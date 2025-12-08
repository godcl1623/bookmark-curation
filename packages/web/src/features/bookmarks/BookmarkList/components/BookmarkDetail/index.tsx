import type { Bookmark } from "@linkvault/shared";
import { type AxiosResponse, isAxiosError } from "axios";
import { Calendar, CalendarCog, Edit, Share2, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

import type { DefaultModalChildrenProps } from "@/app/providers/ModalProvider/types";
import BasicDetailView from "@/features/bookmarks/BookmarkList/components/BookmarkDetail/BasicDetailView.tsx";
import DetailEdit from "@/features/bookmarks/BookmarkList/components/BookmarkDetail/DetailEdit";
import Button from "@/shared/components/atoms/button";
import ModalLayout from "@/shared/components/layouts/modal";
import ModalTemplate from "@/shared/components/layouts/modal/ModalTemplate";
import {
  CardAction,
  CardDescription,
} from "@/shared/components/organisms/card";
import useEdit from "@/shared/hooks/useEdit.ts";
import useHandleSubmit from "@/shared/hooks/useHandleSubmit";
import { cn } from "@/shared/lib/utils";
import deleteBookmark from "@/shared/services/bookmarks/delete-bookmark";
import updateBookmark from "@/shared/services/bookmarks/update-bookmark";
import type { BasicComponentProps } from "@/shared/types";

export default function BookmarkDetail({
  reject,
  resolve,
  data_id,
  refetch,
  ...props
}: DefaultModalChildrenProps & Bookmark & { refetch?: () => void }) {
  const [isEdit, changeEditMode] = useEdit();

  const { urlErrorMessage, titleErrorMessage, noteErrorMessage, handleSubmit } =
    useHandleSubmit({
      onSubmit: (data) => updateBookmark(data_id, data),
      successMessage: "북마크를 성공적으로 수정했습니다.",
      errorMessage: "북마크 수정에 실패했습니다.",
    });

  const deleteCallback = () => {
    refetch?.();
    resolve();
  };

  const updateCallback = () => {
    refetch?.();
    changeEditMode(false)();
  };

  return (
    <ModalLayout reject={reject}>
      <ModalTemplate
        reject={reject}
        width={"w-1/3"}
        height={"h-[85vh]"}
        title={"Bookmark Details"}
        actionComponent={() => (
          <CardAction
            className={cn(
              "grid w-full gap-2 border-t border-neutral-200 p-5",
              isEdit ? "grid-cols-2" : "grid-cols-3"
            )}
          >
            {isEdit ? (
              <EditAcitonSet
                onCancel={changeEditMode(false)}
                formId={FORM_ID}
              />
            ) : (
              <DetailActionSet
                onEdit={changeEditMode(true)}
                onDelete={handleDelete(data_id, deleteCallback)}
              />
            )}
          </CardAction>
        )}
      >
        <div className={"h-1/2 w-full bg-neutral-100"} />
        <CardDescription className={"flex flex-col gap-5 p-5"}>
          {isEdit ? (
            <DetailEdit
              formId={FORM_ID}
              initial={{
                title: props.title,
                url: props.url,
                description: props.description ?? "",
                tags: props.tags,
                parent_id: props.parent_id,
              }}
              onSubmit={handleSubmit(updateCallback)}
              errorMessages={{
                url: urlErrorMessage,
                title: titleErrorMessage,
                note: noteErrorMessage,
              }}
            />
          ) : (
            <BasicDetailView data_id={data_id} refetch={refetch} {...props} />
          )}
          <DateInfo
            created_at={props.created_at}
            updated_at={props.updated_at}
          />
        </CardDescription>
      </ModalTemplate>
    </ModalLayout>
  );
}

const FORM_ID = "bookmark-detail-edit-form";

const handleDelete = (data_id: string, callback?: () => void) => async () => {
  try {
    const result = (await deleteBookmark(data_id)) as AxiosResponse;
    if (result.status === 200) {
      toast.success("북마크를 성공적으로 삭제했습니다.");
      callback?.();
    }
  } catch (error) {
    if (isAxiosError(error)) {
      toast.error(`북마크를 삭제하지 못했습니다(${error.status})`);
    } else if (error instanceof Error) {
      toast.error(`북마크를 삭제하지 못했습니다(${error.name})`);
    }
    console.error(error);
  }
};

interface ActionButtonProps extends BasicComponentProps {
  style?: "primary" | "secondary" | "cancel";
  onClick?: () => void;
  form?: string;
  type?: "submit" | "button";
}

function ActionButton({
  children,
  style = "secondary",
  onClick = () => null,
  form,
  type = "button",
}: ActionButtonProps) {
  const styles = {
    primary: "bg-blue-100 text-blue-500",
    secondary: "bg-neutral-200",
    cancel: "bg-red-100 text-red-500",
  };

  return (
    <Button
      type={type}
      {...(form && { form })}
      size={"custom"}
      variant={"blank"}
      className={cn("w-full py-1.5 text-base", styles[style])}
      onClick={onClick}
    >
      {children}
    </Button>
  );
}

interface DetailActionSetProps {
  onEdit: () => void;
  onDelete: () => void;
}

function DetailActionSet({ onEdit, onDelete }: DetailActionSetProps) {
  return (
    <>
      <ActionButton style={"primary"}>
        <Share2 />
        Share
      </ActionButton>
      <ActionButton onClick={onEdit}>
        <Edit />
        Edit
      </ActionButton>
      <ActionButton style={"cancel"} onClick={onDelete}>
        <Trash2 />
        Delete
      </ActionButton>
    </>
  );
}

interface EditActionSetProps {
  onCancel: () => void;
  formId: string;
}

function EditAcitonSet({ onCancel, formId }: EditActionSetProps) {
  return (
    <>
      <ActionButton onClick={onCancel}>Cancel</ActionButton>
      <ActionButton style={"primary"} form={formId} type={"submit"}>
        Submit
      </ActionButton>
    </>
  );
}

interface DateInfoProps {
  created_at?: string;
  updated_at?: string;
}

function DateInfo({ created_at, updated_at }: DateInfoProps) {
  return (
    <div
      className={"flex-center-between border-t border-neutral-200 px-5 pt-5"}
    >
      <div className={"flex-center gap-2"}>
        <div className={"rounded-lg bg-neutral-100 p-2"}>
          <Calendar />
        </div>
        <div>
          <h3 className={"text-xs font-semibold"}>Created:</h3>
          <p className={"text-lg font-bold text-black"}>
            {created_at ? created_at.split("T")[0] : "-"}
          </p>
        </div>
      </div>
      <div className={"flex-center gap-2"}>
        <div className={"rounded-lg bg-neutral-100 p-2"}>
          <CalendarCog />
        </div>
        <div>
          <h3 className={"text-xs font-semibold"}>Modified:</h3>
          <p className={"text-lg font-bold text-black"}>
            {updated_at ? updated_at.split("T")[0] : "-"}
          </p>
        </div>
      </div>
    </div>
  );
}
