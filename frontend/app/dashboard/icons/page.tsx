'use client';
import PageContainer from '../components/container/PageContainer';
import BasicCard from '../components/shared/BasicCard';

const Icons = () => {
  return (
    <PageContainer title="Icons" description="this is Icons">

      <BasicCard title="Icons">
      <iframe src="https://tabler-icons.io/"  title="Inline Frame Example" frameBorder={0}
    width="100%"
    height="650"></iframe>
      </BasicCard>
    </PageContainer>
  );
};

export default Icons;
