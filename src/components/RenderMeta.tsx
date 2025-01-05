import Head from "next/head";

interface MetaProps {
  title: string;
  description: string;
  img: string;
  newTag?: JSX.Element;
}

const RenderMeta = ({ title, description, img, newTag }: MetaProps) => {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta itemProp="name" content={title} />
      <meta itemProp="description" content={description} />
      <meta itemProp="image" content={img} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={img} />
      <meta property="og:image:url" content={img} />
      <meta property="og:image:alt" content="أصيل | aseel" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@investaseel" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={img} />
      {newTag}
    </Head>
  );
};

export default RenderMeta;
