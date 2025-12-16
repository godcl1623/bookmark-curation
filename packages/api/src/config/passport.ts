import passport from "passport";
import {
  Strategy as JwtStrategy,
  ExtractJwt,
  StrategyOptions as JwtStrategyOptions,
} from "passport-jwt";
import { Strategy as GoogleStrategy, Profile as GoogleProfile } from "passport-google-oauth20";
import prisma from "../lib/prisma";
import { DecodedJwtPayload } from "../lib/auth";

const getJwtSecret = (): string => {
  const secret = process.env.JWT_ACCESS_SECRET;
  if (!secret) {
    throw new Error("JWT_ACCESS_SECRET is not defined");
  }
  return secret;
};

const getGoogleConfig = () => {
  const clientID = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const callbackURL = process.env.GOOGLE_CALLBACK_URL;

  if (!clientID || !clientSecret || !callbackURL) {
    throw new Error("Google OAuth configuration is incomplete");
  }

  return { clientID, clientSecret, callbackURL };
};

const jwtOptions: JwtStrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: getJwtSecret(),
};

passport.use(
  "jwt",
  new JwtStrategy(jwtOptions, async (payload: DecodedJwtPayload, done) => {
    try {
      if (payload.type !== "access") {
        return done(null, false, { message: "Invalid token type" });
      }

      const user = await prisma.users.findUnique({
        where: {
          id: payload.userId,
          is_active: true,
        },
        select: {
          id: true,
          uuid: true,
          email: true,
          display_name: true,
          avatar_url: true,
          locale: true,
          is_active: true,
        },
      });

      if (!user) {
        return done(null, false, { message: "User not found or inactive" });
      }

      return done(null, user);
    } catch (error) {
      return done(error, false);
    }
  })
);

const googleConfig = getGoogleConfig();

passport.use(
  "google",
  new GoogleStrategy(
    {
      clientID: googleConfig.clientID,
      clientSecret: googleConfig.clientSecret,
      callbackURL: googleConfig.callbackURL,
      scope: ["profile", "email"],
    },
    async (
      _accessToken: string,
      _refreshToken: string,
      profile: GoogleProfile,
      done
    ) => {
      try {
        const email = profile.emails?.[0]?.value;
        const googleId = profile.id;

        if (!email || !googleId) {
          return done(new Error("Email or Google ID not found in profile"), undefined);
        }

        let userProvider = await prisma.user_providers.findUnique({
          where: {
            provider_provider_user_id: {
              provider: "google",
              provider_user_id: googleId,
            },
          },
          include: {
            users: true,
          },
        });

        if (userProvider) {
          await prisma.user_providers.update({
            where: { id: userProvider.id },
            data: {
              updated_at: new Date(),
            },
          });

          return done(null, userProvider.users);
        }

        let user = await prisma.users.findUnique({
          where: { email },
        });

        if (!user) {
          user = await prisma.users.create({
            data: {
              email,
              email_verified: profile.emails?.[0]?.verified ?? false,
              display_name: profile.displayName,
              avatar_url: profile.photos?.[0]?.value,
              locale: profile._json.locale,
              is_active: true,
            },
          });
        }

        await prisma.user_providers.create({
          data: {
            user_id: user.id,
            provider: "google",
            provider_user_id: googleId,
            provider_email: email,
          },
        });

        return done(null, user);
      } catch (error) {
        return done(error as Error, undefined);
      }
    }
  )
);

export default passport;
