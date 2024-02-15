import { getApiDocs } from '@/lib/swagger';
import ReactSwagger from './react-swagger';

export default async function IndexPage() {
  const spec = await getApiDocs();
  return (
    <section className="w-full min-h-[100svh] absolute top-0 bg-white text-black">
      <ReactSwagger spec={spec} />
    </section>
  );
}