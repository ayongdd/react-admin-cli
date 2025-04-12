import { UploadOutlined } from "@ant-design/icons";
import {
	Button,
	Card,
	Col,
	Form,
	Input,
	message,
	Row,
	Tag,
	Upload,
	type UploadProps,
} from "antd";
import type { UploadChangeParam } from "antd/es/upload";
import type { UploadFile } from "antd/lib";
import React, { useState } from "react";
import { signApi } from "~/api";
import type {
	GenerateFormValues,
	InfoModalFieldType,
} from "~/components/InfoModal";
import SignListModel from "~/components/SignModal";
import { getUserInfo, storage } from "~/utils";

const SingAdd: React.FC = () => {
	const [form] = Form.useForm();
	const [initialValues, _] = useState<Record<string, unknown> | undefined>();

	const [signModalVisible, setSignModalVisible] = useState<boolean>(false);
	const [signValues] = useState<Record<string, unknown> | undefined>();
	const [key, setKey] = useState(0);
	const [loading, setLoading] = useState<boolean>(false);
  const [ipaInfo, setIpaInfo] = useState<ApiType.Sign.IpaInfo>({
    id: "",
    bundleId: "",
    bundleName: "",
    bundleVersion: ""
  })
	const BeforeUpload = (_: UploadFile) => {
		return true;
	};
	const p12HandleChange: UploadProps["onChange"] = (
		info: UploadChangeParam<UploadFile>,
	) => {
		if (!info?.file) return message.error(`${info.file.name} 上传失败！`);
		if (info.file.status !== "uploading") {
			console.log(info.file, info.fileList);
		}
		if (info.file.status === "done") {
			if (info.file?.response?.code === 200) {
				message.success(info.file?.response?.message);
				const ipaInfo = info.file?.response.data as ApiType.Sign.IpaInfo;
        setIpaInfo(ipaInfo);
				setKey((prev) => prev + 1);
				return;
			}
			message.warning(info.file?.response?.message || "上传失败！");
			if (info.file?.response?.code === 401) {
				localStorage.clear();
				setTimeout(() => {
					location.reload();
				}, 1000);
			}
		} else if (info.file.status === "error") {
			message.error(`${info.file.name} 上传失败！`);
		}
	};

  const token = storage.get("token") as ApiType.Auth.UserClaim
  const info = getUserInfo();

	// * 编辑表单项
	const infoFields: InfoModalFieldType[] = [
		{
			name: "ipa",
			label: "上传IPA文件",
			type: "inputUpload",
			beforeUpload: BeforeUpload,
			onChange: p12HandleChange,
			props: {
				accept: ".ipa",
			},
			// fileList: p12FileList?.url ? [p12FileList] : [],
			rules: [{ required: true, message: "IPA文件不能为空" }],
		},
    {
			name: "bundleVersion",
			label: "IPA版本号",
			type: "input",
			span: 24,
			readonly: true,
			disabled: true,
			defaultValue: ipaInfo.bundleVersion,
      placeText:"上传完ipa文件后自动同步",
			rules: [{ required: false, message: "上传完ipa文件后自动同步" }],
		},
		{
			name: "bundleName",
			label: "Bundle名称",
			type: "input",
			span: 24,
			readonly: true,
			disabled: true,
			defaultValue: ipaInfo.bundleName,
      placeText:"上传完ipa文件后自动同步",
			rules: [{ required: false, message: "上传完ipa文件后自动同步" }],
		},
		{
			name: "bundleId",
			label: "Bundle ID",
			type: "input",
			span: 24,
			readonly: true,
			disabled: true,
			defaultValue: ipaInfo.bundleId,
      placeText:"上传完ipa文件后自动同步",
			rules: [{ required: false, message: "上传完ipa文件后自动同步" }],
		},
		{
			name: "provisionBundleId",
			label: "企业证书bid(签名后的包名)",
			type: "input",
			span: 24,
			readonly: true,
			disabled: true,
			defaultValue: info?.provision_bundle_id,
			rules: [{ required: false, message: "Bundle ID不能为空" }],
		},
		{
			name: "p12Password",
			label: ".P12密码",
			type: "input",
			span: 24,
			rules: [{ required: true, message: ".P12密码不能为空" }],
		},
	];
	const handleSubmitInfo = async (
		values: GenerateFormValues<typeof infoFields>,
	) => {
		setLoading(true);
		try {
      const param: ApiType.Sign.Operate = { p12Password: values.p12Password as string, ...ipaInfo}
			if (!param?.id) {
				message.warning("还未上传ipa 文件");
				return;
			}
			const { code, message: msg } = await signApi.operate(param);
			if (code === 200) {
				message.success(msg);
				setLoading(false);
				setTimeout(() => {
          setIpaInfo({
            id: "",
            bundleId: "",
            bundleName: "",
            bundleVersion: ""
          })
					form.resetFields();
				}, 100);
				return;
			}
			message.warning(msg);
			setLoading(false);
		} catch (e) {
			setLoading(false);
		}
		setLoading(false);
	};

	const handleOk = () => {
		form.validateFields().then((values) => handleSubmitInfo(values));
	};

	const onRemove = (_: UploadFile): boolean => {
    setIpaInfo({
      id: "",
      bundleId: "",
      bundleName: "",
      bundleVersion: ""
    })
		form.resetFields();
		return true;
	};

	return (
		<React.Fragment>
			<Card style={{ marginBottom: 10, width: 800 }}>
				<p style={{ margin: 0 }}>此服务允许您在线签署 IPA 文件</p>
				<div>
					<Tag
						color="processing"
						bordered={false}
						style={{ marginTop: "10px" }}
					>
						上传您要签署的IPA文件
					</Tag>
				</div>
				<div>
					<Tag
						color="processing"
						bordered={false}
						style={{ marginTop: "10px" }}
					>
						自动同步您的bundle名称ID
					</Tag>
				</div>
				<div>
					<Tag
						color="processing"
						bordered={false}
						style={{ marginTop: "10px" }}
					>
						输入.P12证书密码，如没有请联系系统管理员
					</Tag>
				</div>
				<div>
					<Tag
						color="processing"
						bordered={false}
						style={{ marginTop: "10px" }}
					>
						点击【签名】即可完成在线签署，到签名记录中下载您所需文件
					</Tag>
				</div>
			</Card>
			<Card style={{ marginBottom: 20, width: 800, position: "relative" }}>
				<Row gutter={24}>
					<Col
						span={24}
						style={{
							display: "flex",
							justifyContent: "space-between",
							justifyItems: "center",
						}}
					>
						<span
							color="processing"
							style={{
								fontSize: "20px",
								color: "#1677ff",
								marginBottom: "20px",
							}}
						>
							{`${(getUserInfo() as ApiType.User.Info)?.tenant_name}欢迎您～`}
						</span>
						<Button
							type="link"
							style={{ float: "right" }}
							onClick={() => setSignModalVisible(true)}
						>
							签名记录
						</Button>
					</Col>
				</Row>
				<Form
					form={form}
					layout="vertical"
					initialValues={initialValues}
					preserve={false}
					onFinish={handleOk}
					autoComplete="off"
				>
					<Row gutter={24}>
						{infoFields.map((field) => (
							<Col span={field.span ?? 12} key={field.name}>
								<Form.Item
									name={field.name}
									label={field.label}
									rules={field.rules ?? []}
								>
									{field.type === "input" && !field?.hidden && (
										<Input
											key={key}
											readOnly={field.readonly}
											disabled={field?.disabled}
											defaultValue={field?.defaultValue}
											placeholder={
												field?.placeText
													? field.placeText
													: `请输入${field.label}`
											}
											{...field.props}
										/>
									)}

									{field.type === "inputUpload" && (
										<Upload
											{...field.props}
											maxCount={1}
											beforeUpload={field?.beforeUpload}
											onChange={field?.onChange}
											action={`${import.meta.env.VITE_APP_BASE_API}/sign/ipa_info`}
											name="ipa"
											onRemove={onRemove}
											defaultFileList={field?.fileList}
											headers={{
												Authorization: `Bearer ${token?.accessToken}`,
											}}
										>
											<Button icon={<UploadOutlined />}>点击上传</Button>
										</Upload>
									)}
								</Form.Item>
							</Col>
						))}
						<Col
							span={24}
							style={{ display: "flex", justifyContent: "center" }}
						>
							<Button
								type="primary"
								htmlType="submit"
								loading={loading}
								style={{ width: `${400}px` }}
							>
								签名
							</Button>
						</Col>
					</Row>
				</Form>
			</Card>
			{signModalVisible && (
				<SignListModel
					visible={signModalVisible}
					initialValues={signValues}
					isadd={true}
					title={"签名记录"}
					onClose={() => setSignModalVisible(false)}
				/>
			)}
		</React.Fragment>
	);
};

export default SingAdd;
