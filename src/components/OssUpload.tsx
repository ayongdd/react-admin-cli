import { UploadOutlined } from "@ant-design/icons";
import { App, Button, Upload, type UploadFile } from "antd";
import type { UploadProps } from "antd/lib";
import { useState } from "react";
import { tenantApi } from "~/api";

interface OSSUploadProps {
	value?: UploadFile[];
	onChange?: (fileList: UploadFile[]) => void;
}

export const OSSUpload: React.FC<Readonly<OSSUploadProps>> = ({
	// value,
	// onChange,
}) => {
	const { message } = App.useApp();

	const [file, setFile] = useState<UploadFile>();
	const [uploading, setUploading] = useState(false);

	// const handleChange: UploadProps["onChange"] = ({ fileList }) => {
	// 	console.log("OSS:", fileList);
	// 	onChange?.([...fileList]);
	// };

	// const onRemove = (file: UploadFile) => {
	// 	const files = (value || []).filter((v) => v.url !== file.url);
	// 	onChange?.(files);
	// };

	const handleUpload = async () => {
		if (!file) {
			return;
		}

		const formData = new FormData();

		formData.append("file", file as unknown as File);
		const presignedUrl = await tenantApi.getPresignedUrl(file.name);

		setUploading(true);
		fetch(presignedUrl, {
			method: "PUT",
			body: formData,
		})
			.then((res) => res.json())
			.then(() => {
				setFile(undefined);
				message.success("upload successfully.");
			})
			.catch((err) => {
				console.log("upload err", err);

				message.error("upload failed.");
			})
			.finally(() => {
				setUploading(false);
			});
	};

	const props: UploadProps = {
		onRemove: () => {
			setFile(undefined);
		},
		beforeUpload: (file) => {
			setFile(file);

			return false;
		},
	};

	return (
		<>
			<Upload {...props}>
				<Button icon={<UploadOutlined />}>选择文件</Button>
			</Upload>
			<Button
				icon={<UploadOutlined />}
				type="primary"
				onClick={handleUpload}
				disabled={!file}
				loading={uploading}
			>
				上传
			</Button>
		</>
	);
};
