{
  isSuccess && data.pages[0].length > 0 ? (
    <>
      <ul className="flex flex-col items-center w-full">
        {data.pages.map((page: AllData[], pageIndex) =>
          page.map((item, index) => (
            <li
              key={`${pageIndex}-${index}`}
              className="w-full flex justify-center"
            >
              <div className="w-full max-w-[375px]">
                <ItemBox item={mapFoundDataToItemData(item)} itemType="found" />
              </div>
            </li>
          ))
        )}
      </ul>
    </>
  ) : null;
}
