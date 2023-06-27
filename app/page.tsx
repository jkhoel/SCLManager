// prettier-ignore
'use client'

import dynamic from "next/dynamic";

const DynamicApp = dynamic(() => import("../screen/app"), {
  ssr: false,
});

const Home = () => <DynamicApp />;

export default Home;
