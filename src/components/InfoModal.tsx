import { UploadOutlined } from "@ant-design/icons";
import {
	Button,
	Col,
	DatePicker,
	Form,
	Input,
	InputNumber,
	Modal,
	Radio,
	Row,
	Select,
	Upload,
	type UploadFile,
} from "antd";
import type { Rule } from "antd/es/form";
import type { UploadChangeParam } from "antd/es/upload";
import { getDefaultStore } from "jotai";
import React from "react";
import { authJotai } from "~/store";

export type GenerateFormValues<T extends InfoModalFieldType[]> = {
	[K in T[number]["name"]]: unknown;
};

export type InfoModalFieldType = {
	name: string;
	label: string;
	type: "input" | "select" | "radio" | "date" | "inputNumber" | "inputUpload";
	options?: Array<{ label: string; value: string | number }>;
	rules?: Array<Rule>;
	span?: number;
	placeText?: string;
	readonly?: boolean;
	imageUrl?: string | undefined;
	loading?: boolean | undefined;
	beforeUpload?: (
		file: UploadFile,
		fileList: UploadFile[],
	) => boolean | Promise<File>;
	// biome-ignore lint/suspicious/noExplicitAny: allowed
	onChange?: ((info: UploadChangeParam<UploadFile<any>>) => void) | undefined;
	onRemove?: ((file: UploadFile<any>) => void | boolean | Promise<void | boolean>) | undefined;
	fileList?: UploadFile[];
	hidden?: boolean;
	with?: number;
	disabled?: boolean;
	key?: number;
	defaultValue?:string;
	props?: Record<string, unknown>;
};

type InfoModalProps<T extends InfoModalFieldType[]> = {
	visible: boolean;
	onClose: () => void;
	onSubmit: (values: GenerateFormValues<T>) => void;
	initialValues?: Record<string, unknown>;
	fields: InfoModalFieldType[];
	data?: Record<string, unknown>;
	title?: string;
	width?: number;
	children?: React.ReactElement;
};

const InfoModal = <T extends InfoModalFieldType[]>({
	visible,
	initialValues,
	fields,
	onSubmit,
	title,
	width,
	onClose,
	children,
}: InfoModalProps<T>): React.ReactElement => {
	const [form] = Form.useForm();
	const handleOk = () => {
		form.validateFields().then((values) => onSubmit(values));
	};

	React.useEffect(() => {
		if (visible && initialValues) {
			form.setFieldsValue(initialValues);
		}
	}, [visible, initialValues, form]);
	const store = getDefaultStore();
	const token = store.get(authJotai.tokenAtom);
	return (
		<>
			<Modal
				title={title}
				open={visible}
				width={width ? width : 800}
				destroyOnClose
				onOk={handleOk}
				onCancel={onClose}
				maskClosable={false}
				style={{
					top: 30,
				}}
			>
				<Form
					form={form}
					layout="vertical"
					initialValues={initialValues}
					preserve={false}
					autoComplete="off"
				>
					<Row gutter={24}>
						{fields.map((field) => (
							<Col span={field.span ?? 12} key={field.name}>
								<Form.Item
									name={field.name}
									label={field.label}
									rules={field.rules ?? []}
								>
									{field.type === "input" && !field?.hidden && (
										<Input
											readOnly={field?.readonly}
											disabled={field?.disabled}
											placeholder={
												field?.placeText
													? field.placeText
													: `请输入${field.label}`
											}
											{...field.props}
										/>
									)}
									{field.type === "inputNumber" && (
										<InputNumber {...field.props} />
									)}

									{field.type === "inputUpload" && (
										<Upload
											{...field.props}
											maxCount={1}
											beforeUpload={field?.beforeUpload}
											onChange={field?.onChange}
											onRemove={field?.onRemove}
											disabled = {field?.disabled}
											key={field?.key}
											action={`${import.meta.env.VITE_APP_BASE_API}/tenant/upload`}
											defaultFileList={field?.fileList}
											headers={{
												Authorization: `Bearer ${token?.accessToken}`,
											}}
										>
											<Button icon={<UploadOutlined />}>点击上传</Button>
										</Upload>
									)}

									{field.type === "select" && (
										<Select
											placeholder={`请选择${field.label}`}
											allowClear
											options={field.options}
											{...field.props}
										/>
									)}
									{field.type === "radio" && (
										<Radio.Group {...field.props}>
											{field.options?.map((option) => (
												<Radio key={option.value} value={option.value}>
													{option.label}
												</Radio>
											))}
										</Radio.Group>
									)}
									{field.type === "date" && (
										<DatePicker style={{ width: "100%" }} {...field.props} />
									)}
								</Form.Item>
							</Col>
						))}
						{children}
					</Row>
				</Form>
			</Modal>
		</>
	);
};

export default InfoModal;
