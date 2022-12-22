import { MFLoaderComponent } from '@/components';
import { useParams } from 'umi';

export default () => {
  const params = useParams();
  return (
    <div>
      <MFLoaderComponent
        $loader={{ componentName: `micro-app1/${params.pageId}` }}
      />
    </div>
  );
};
