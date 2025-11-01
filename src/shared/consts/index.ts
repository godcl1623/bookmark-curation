import type { Bookmark } from "@/shared/types/bookmark.ts";

export const DUMMY_FOLDERS = [
  "No Folder",
  "Folder 1",
  "Folder 2",
  "Folder 3",
  "Folder 4",
  "Folder 5",
  "Folder 6",
  "Folder 7",
  "Folder 8",
];

export const DIRECTORY: Bookmark[] = [
  {
    id: "F9iD9XnIwusA",
    type: "folder",
    parent: null,
    name: "Folder 1",
    children: [
      {
        id: "uI9Y9Jwz74z5",
        type: "folder",
        parent: "Folder 1",
        name: "Sub 1",
        children: [
          {
            id: "YWYhIU4-83uJ",
            type: "bookmark",
            parent: "Folder 1/Sub 1",
            name: "Bookmark 1",
          },
          {
            id: "i1V2USuTd82Y",
            type: "bookmark",
            parent: "Folder 1/Sub 1",
            name: "Bookmark 2",
          },
          {
            id: "6mSMtcQcd6nP",
            type: "bookmark",
            parent: "Folder 1/Sub 1",
            name: "Bookmark 3",
          },
        ],
      },
      {
        id: "EzYKonbIPVzK",
        type: "bookmark",
        parent: "Folder 1",
        name: "Bookmark 1",
      },
    ],
  },
  {
    id: "UwUPD9ue-rbX",
    type: "folder",
    parent: null,
    name: "Folder 2",
    children: [
      {
        id: "xpT0yNxO2NSx",
        type: "folder",
        parent: "Folder 2",
        name: "Sub 1",
        children: [
          {
            id: "paynCrdrgF5h",
            type: "bookmark",
            parent: "Folder 2/Sub 1",
            name: "Bookmark 1",
          },
          {
            id: "vgDrwz8F5ELk",
            type: "bookmark",
            parent: "Folder 2/Sub 1",
            name: "Bookmark 2",
          },
        ],
      },
      {
        id: "mN8p30ueC9ik",
        type: "folder",
        parent: "Folder 2",
        name: "Sub 2",
        children: [
          {
            id: "5C6oSvLn2G2b",
            type: "bookmark",
            parent: "Folder 2/Sub 2",
            name: "Bookmark 1",
          },
        ],
      },
      {
        id: "VmVp288YTBeu",
        type: "bookmark",
        parent: "Folder 2",
        name: "Bookmark 1",
      },
      {
        id: "1rQLzsJbDUei",
        type: "bookmark",
        parent: "Folder 2",
        name: "Bookmark 2",
      },
    ],
  },
  {
    id: "ZvF2ntqSALro",
    type: "folder",
    parent: null,
    name: "Folder 3",
    children: [
      {
        id: "_E8Sc_Qfs9pJ",
        type: "folder",
        parent: "Folder 3",
        name: "Sub 1",
        children: [
          {
            id: "YzidXZjmPpbl",
            type: "bookmark",
            parent: "Folder 3/Sub 1",
            name: "Bookmark 1",
          },
          {
            id: "nHlqPKDOx6VS",
            type: "bookmark",
            parent: "Folder 3/Sub 1",
            name: "Bookmark 2",
          },
          {
            id: "Nl8yiUBsQx1z",
            type: "bookmark",
            parent: "Folder 3/Sub 1",
            name: "Bookmark 3",
          },
        ],
      },
      {
        id: "7NkYXeVttEzL",
        type: "folder",
        parent: "Folder 3",
        name: "Sub 2",
        children: [
          {
            id: "VFqz1-CB3P7c",
            type: "bookmark",
            parent: "Folder 3/Sub 2",
            name: "Bookmark 1",
          },
          {
            id: "HyvCmxpe2mU0",
            type: "bookmark",
            parent: "Folder 3/Sub 2",
            name: "Bookmark 2",
          },
        ],
      },
      {
        id: "8JofGZpu_spi",
        type: "folder",
        parent: "Folder 3",
        name: "Sub 3",
        children: [
          {
            id: "E7USwIG7DsI1",
            type: "bookmark",
            parent: "Folder 3/Sub 3",
            name: "Bookmark 1",
          },
        ],
      },
      {
        id: "yjzzC7ufMHmU",
        type: "bookmark",
        parent: "Folder 3",
        name: "Bookmark 1",
      },
      {
        id: "Lhn7LVeKZmIC",
        type: "bookmark",
        parent: "Folder 3",
        name: "Bookmark 2",
      },
      {
        id: "vQE2J-saMkhp",
        type: "bookmark",
        parent: "Folder 3",
        name: "Bookmark 3",
      },
    ],
  },
];
