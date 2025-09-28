import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ItemDetail from '@/entities/item/ui/ItemDetail';
import { getSearchId } from '@/lib/utils/getAPIData';
import useDetailDataStore from '@/entities/item/model/useDetailDataStore';
import Header from '@/widgets/header/ui/Header';

const GetDetail = () => {
  const setDetail = useDetailDataStore((state) => state.setDetail);
  const detail = useDetailDataStore((state) => state.detail);
  const { id } = useParams<{ id?: string }>();

  useEffect(() => {
    (async () => {
      if (!id) return;
        const data = await getSearchId(id);

      setDetail(data);
    })();
  }, [id, setDetail]);

  return (
    <div className="mx-auto w-[375px]">
      <Header children="습득물 상세정보" isShowPrev empty />
      {detail && <ItemDetail detail={detail} />}
    </div>
  );
};

export default GetDetail;
