import DataAddForm from "@/features/bookmarks/Header/components/common/DataAddForm";

export default function AddTags() {
  return (
    <article className={"h-[calc(100%-50px)] overflow-y-auto p-5"}>
      <DataAddForm
        title={"Add New Tag"}
        inputOptions={{ placeholder: "Tag Name", name: "" }}
        onSubmit={() => null}
      />
      {/* FIXME: 로딩, 에러 화면 구성 */}
      {/*{isLoading && <p>Loading...</p>}*/}
      {/*{isError && <p>Error loading folders.</p>}*/}
      {/*{!isLoading && !isError && folders && folders.length > 0 && (*/}
      {/*  <ul className={"mt-5 flex flex-col gap-2"}>*/}
      {/*    {folders.map((folder) => (*/}
      {/*      <li key={`option-${folder.id}`}>*/}
      {/*        <FolderListItem {...folder} />*/}
      {/*      </li>*/}
      {/*    ))}*/}
      {/*  </ul>*/}
      {/*)}*/}
    </article>
  );
}
