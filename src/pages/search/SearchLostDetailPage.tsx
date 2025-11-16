import { useHeaderConfig } from '@/widgets/header/model/HeaderConfigContext';
import SearchDate from '@/features/search/ui/SearchDate';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSearchLostData } from '@/lib/utils/getAPIData';
import useSearchStore from '@/features/search/model/searchStore';
import getFormattedDate from '@/lib/utils/getFormattedDate';
import {
  mainCategories,
  subCategories,
  areas
} from '@/features/search/constants';
import { ChevronRight } from 'lucide-react';
import { logger } from '@/lib/utils/logger';

interface SearchData {
  body?: {
    items?: {
      item: object[];
    };
  };
}

const SearchLostDetail = () => {
  const {
    selectStartDate,
    setSelectStartDate,
    selectEndDate,
    setSelectEndDate,
    selectedMainCategoryValue,
    setSelectedMainCategoryValue,
    selectedSubCategoryValue,
    setSelectedSubCategoryValue,
    selectedAreaValue,
    setSelectedAreaValue,
    setResultData
  } = useSearchStore();

  const navigate = useNavigate();

  const handleMainCategoriesSelectChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = e.target.value;
    setSelectedMainCategoryValue(value);
    setSelectedSubCategoryValue('');
  };

  const handleSubCategoriesSelectChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = e.target.value;
    setSelectedSubCategoryValue(value);
  };

  const handleAreasSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedAreaValue(value);
  };

  const handleSearchButtonClick = () => {
    if (selectStartDate === '날짜를 선택하세요.') {
      alert('분실 시작일을 선택하세요.');
    } else if (selectEndDate === '날짜를 선택하세요.') {
      alert('분실 종료일을 선택하세요.');
    } else {
      navigate('/searchlostresult');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const searchData = await getSearchLostData({
          PRDT_CL_CD_01: selectedMainCategoryValue,
          PRDT_CL_CD_02: selectedSubCategoryValue,
          LST_LCT_CD: selectedAreaValue,
          START_YMD:
            selectStartDate !== '날짜를 선택하세요.'
              ? getFormattedDate(selectStartDate)
              : '',
          END_YMD:
            selectEndDate !== '날짜를 선택하세요.'
              ? getFormattedDate(selectEndDate)
              : '',
          pageNo: 1,
          numOfRows: 6,
        });

        if (typeof searchData === 'object') {
          const resultData = (searchData as SearchData).body?.items?.item;
          setResultData(resultData ?? null);
        }
      } catch (error) {
        logger.error('분실물 상세 검색 데이터 요청 실패', error);
      }
    };

    fetchData();
  }, [
    selectedMainCategoryValue,
    selectedSubCategoryValue,
    selectedAreaValue,
    selectStartDate,
    selectEndDate,
  ]);

  useHeaderConfig(
    () => ({
      isShowPrev: true,
      empty: true,
      children: '분실물 상세검색'
    }),
    []
  );

  return (
    <div className="min-h-nav-safe flex w-full flex-col bg-[#f8f8f8]">
      <div className="mx-auto w-full max-w-4xl px-4 py-6 md:py-8">
        <div className="rounded-3xl bg-white p-6 shadow-sm md:p-8">
          <form>
            <div className="mb-8">
              <label className="mb-4 block text-[#1a1a1a]">분류</label>
              <div className="flex flex-col gap-3 md:flex-row">
                <div className="relative flex-1">
                  <select
                    id="mainCategory"
                    value={selectedMainCategoryValue}
                    onChange={handleMainCategoriesSelectChange}
                    className="w-full appearance-none rounded-xl border border-gray-200 bg-white px-4 py-3 transition-colors hover:border-[#4F7EFF]"
                  >
                    {mainCategories.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                  <ChevronRight className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#666]" />
                </div>
                <div className="relative flex-1">
                  <select
                    id="subCategory"
                    value={selectedSubCategoryValue}
                    onChange={handleSubCategoriesSelectChange}
                    className="w-full appearance-none rounded-xl border border-gray-200 bg-white px-4 py-3 transition-colors hover:border-[#4F7EFF]"
                  >
                    {subCategories[selectedMainCategoryValue] &&
                      subCategories[selectedMainCategoryValue].map(
                        (subCategory) => (
                          <option
                            key={subCategory.value}
                            value={subCategory.value}
                          >
                            {subCategory.label}
                          </option>
                        )
                      )}
                  </select>
                  <ChevronRight className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#666]" />
                </div>
              </div>
            </div>

            <div className="mb-8">
              <label className="mb-4 block text-[#1a1a1a]">분실 지역</label>
              <div className="relative">
                <select
                  id="area"
                  value={selectedAreaValue}
                  onChange={handleAreasSelectChange}
                  className="w-full appearance-none rounded-xl border border-gray-200 bg-white px-4 py-3 transition-colors hover:border-[#4F7EFF]"
                >
                  {areas.map((area) => (
                    <option key={area.value} value={area.value}>
                      {area.label}
                    </option>
                  ))}
                </select>
                <ChevronRight className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#666]" />
              </div>
            </div>

            <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
              <div>
                <label className="mb-4 block text-[#1a1a1a]">분실 시작일</label>
                <SearchDate
                  selectDate={selectStartDate}
                  setSelectDate={setSelectStartDate}
                >
                  분실 시작일
                </SearchDate>
              </div>

              <div>
                <label className="mb-4 block text-[#1a1a1a]">분실 종료일</label>
                <SearchDate
                  selectDate={selectEndDate}
                  setSelectDate={setSelectEndDate}
                >
                  분실 종료일
                </SearchDate>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSearchButtonClick}
              className="mb-4 w-full rounded-2xl bg-[#4F7EFF] py-4 text-white transition-colors hover:bg-[#3B63E3]"
            >
              검색
            </button>

            <button
              type="button"
              onClick={() => navigate('/searchfind')}
              className="flex w-full items-center justify-center gap-1 text-center text-[#666] transition-colors hover:text-[#4F7EFF]"
            >
              <span>습득물 검색으로 이동하기</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SearchLostDetail;
