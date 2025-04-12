import { Spin } from "antd";
import { Suspense } from "react";

const Loading = () => {
	return (
		<div className="flex items-center justify-center">
			<Spin />
		</div>
	);
};

const lazyLoad = (
	// biome-ignore lint/suspicious/noExplicitAny: allowed
	Component: React.LazyExoticComponent<any>,
): React.ReactNode => {
	return (
		<Suspense fallback={<Loading />}>
			<Component />
		</Suspense>
	);
};

export default lazyLoad;
