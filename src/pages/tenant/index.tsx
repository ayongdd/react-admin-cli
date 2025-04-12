import { AddOne } from "@icon-park/react";
import { useAntdTable } from "ahooks";
import {
	Button,
	Card,
	Form,
	Input,
	message,
	Modal,
	Popconfirm,
	Space,
	Table,
	type TableProps,
	Tag,
} from "antd";
import dayjs from "dayjs";
import React, { useState } from "react";
import { tenantApi } from "~/api";
import QueryForm, { type QueryFormField } from "~/components/QueryForm";
import SignListModel from "~/components/SignModal";
import EditForm from "./form";
import ModfyPassword from "./modfyPassword";
import { toBeijingTime, useClipboard } from "~/utils";

// * 搜索表单项
const queryFormFields: QueryFormField[] = [
	{
		name: "name",
		label: "商户名称",
		type: "input",
	},
	{
		name: "dateRange",
		label: "创建时间",
		type: "dateRange",
	},
];

const Merchants: React.FC = () => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [p12pwd, setP12pwd] = useState("");

	const handleOk = () => {
		setPwd("");
		setIsModalOpen(false);
	};

	const lookpwd = (record: ApiType.Tenant.Info) => {
		setIsModalOpen(true);
		setRecord(record);
	};
	const confirmDelete = async (record: ApiType.Tenant.Info) => {
		const { code, message: msg } = await tenantApi.del(record?.id);
		if (code === 200) {
			message.success(msg);
			refresh();
			return;
		}
		message.warning(msg);
	};

	// * 数据表格项
	const tableColumns: TableProps<ApiType.Tenant.Info>["columns"] = [
		// {
		// 	title: "序号",
		// 	dataIndex: "id",
		// 	key: "id",
		// 	width: 80,
		// 	align: "center",
		// },
		{
			title: "商户ID",
			dataIndex: "id",
			key: "id",
			align: "center",
			width: 80,
		},
		{
			title: "商户名称",
			dataIndex: "name",
			key: "name",
			ellipsis: true,
			align: "center",
		},
		{
			title: (
				<div>
				  <div>P12证书</div>
				  <div>到期时间</div>
				</div>
			  ),
			dataIndex: "p12Cert",
			key: "p12Cert",
			align: "center",
			render: (text, record) =>
				(
					<>
						<p>{ !text ? <Tag color="red">未上传</Tag> : <Tag color="green">已上传</Tag>}</p>
						<p>{ record?.p12Expiry ? toBeijingTime(record?.p12Expiry) : "-"}</p>
					</>
				)
				// !text ? <Tag color="red">未上传</Tag> : <Tag color="green">已上传</Tag>,
		},
		{
			title: "P12证书密码",
			dataIndex: "p12CertPassword",
			key: "p12CertPassword",
			align: "center",
			render: (text, record) =>
				!text ? (
					<>
						*****
						<Button type="link" onClick={() => lookpwd(record)}>
							查看
						</Button>
					</>
				) : (
					"-"
				),
		},
		{
			title: (
				<div>
				  <div>Mobile证书</div>
				  <div>到期时间</div>
				</div>
			),
			dataIndex: "mobileProvision",
			key: "mobileProvision",
			align: "center",
			render: (text, record) => (
				<>
					<p>{ !text ? <Tag color="red">未上传</Tag> : <Tag color="green">已上传</Tag>}</p>
					<p>{ record?.provisionExpiry ? toBeijingTime(record?.provisionExpiry): "-"}</p>
				</>
			),
		},
		{
			title: "企业证书BID",
			dataIndex: "provisionBundleId",
			key: "provisionBundleId",
			align: "center",
		},
		{
			title: "商户登录账号",
			dataIndex: "account",
			key: "account",
			align: "center",
		},
		{
			title: "登录密码",
			dataIndex: "password",
			key: "password",
			align: "center",
		},
		{
			title: "创建时间",
			dataIndex: "createdAt",
			key: "createdAt",
			align: "center",
			render: (text) =>
				text ? toBeijingTime(text) : "-",
		},
		{
			title: "最后操作时间",
			dataIndex: "updatedAt",
			key: "updatedAt",
			align: "center",
			render: (text) =>
				text ? toBeijingTime(text) : "-",
		},
		{
			title: "操作",
			key: "action",
			fixed: "right",
			align: "center",
			render: (_, record) => (
				<>
					<Button
						color="blue"
						variant="link"
						onClick={() => JSON.stringify(record.id) && modifyData(record.id)}
					>
						编辑
					</Button>
					<Button
						color="blue"
						variant="link"
						onClick={() =>
							JSON.stringify(record.id) && modifyPassword(record.userId)
						}
					>
						修改密码
					</Button>
					<Button
						color="blue"
						variant="link"
						onClick={() => JSON.stringify(record.id) && signVisible(record)}
					>
						签名记录
					</Button>

					<Popconfirm
						title="提示"
						description="确定要删除此商户吗？"
						onConfirm={() => JSON.stringify(record.id) && confirmDelete(record)}
						okText="确定"
						cancelText="取消"
					>
						<Button color="red" variant="link">
							删除
						</Button>
					</Popconfirm>
				</>
			),
		},
	];

	const getTableData = async (
		{ current, pageSize }: UtilType.AhookRequestParam,
		formData: {
			name: string;
			dateRange: dayjs.Dayjs[];
		},
	): Promise<{
		total: number;
		list: ApiType.Tenant.Info[];
	}> => {
		const req: ApiType.Tenant.Search = {
			page: current,
			pageSize,
		};

		if (formData.name?.length > 0) {
			req.name = formData.name;
		}

		if (formData.dateRange?.length === 2) {
			req.tsStart = formData.dateRange[0].format();
			req.tsEnd = formData.dateRange[1].format();
		}

		const { total, records } = await tenantApi.list(req);
		return {
			total,
			list: records,
		};
	};

	const [form] = Form.useForm();
	const [infoVisible, setInfoVisible] = useState<boolean>(false);
	const [signModalVisible, setSignModalVisible] = useState<boolean>(false);
	const [modifyPasswordVisible, setModifyPasswordVisible] =
		useState<boolean>(false);
	const [signValues, setSignValues] = useState<
		Record<string, unknown> | undefined
	>();
	const [modifyPasswordId, setModifyPasswordId] = useState<number>();
	const [modifyDataId, setModifyDataId] = useState<number | null>();
	const { tableProps, refresh, search, data } = useAntdTable(getTableData, {
		defaultPageSize: 10,
		form,
	});
	const [pwd, setPwd] = useState<string>();
	const [record, setRecord] = useState<ApiType.Tenant.Info>();
	const { copyToClipboard } = useClipboard();
	const checkP12Pwd = async () => {
		if (record?.id === undefined) return message.warning("获取密码失败");
		const password = await tenantApi.getP12Password({
			password: pwd ?? "",
			tenantId: record?.id * 1,
		});
		if (password) {
			setIsModalOpen(true);
			setP12pwd(password);
			return;
		}
		message.warning("获取密码失败");
	};

	const createData = async () => {
		setModifyDataId(null);
		setInfoVisible(true);
	};

	const modifyPassword = async (id: number) => {
		setModifyPasswordId(id);
		setModifyPasswordVisible(true);
	};

	const modifyData = async (id: number) => {
		setModifyDataId(id);
		setInfoVisible(true);
	};

	const signVisible = async (data: ApiType.Tenant.Info) => {
		setSignValues(data);
		setSignModalVisible(true);
	};
	return (
		<React.Fragment>
			<Card style={{ marginBottom: 20 }}>
				<QueryForm
					fields={queryFormFields}
					onSearch={search.submit}
					form={form}
					onReset={search.reset}
				/>
			</Card>

			<Card
				title="商户列表"
				extra={
					<Space>
						<Button
							type="primary"
							icon={<AddOne theme="outline" size="16" fill="#fff" />}
							onClick={createData}
						>
							新增
						</Button>
					</Space>
				}
			>
				<Table
					columns={tableColumns}
					{...tableProps}
					scroll={{ x: 2000 }}
					rowKey="id"
					pagination={{
						...tableProps.pagination,
						showSizeChanger: true,
						showTotal: () => `共 ${data?.total} 条`,
					}}
				/>
			</Card>

			{infoVisible && (
				<EditForm
					visible={infoVisible}
					onClose={() => setInfoVisible(false)}
					refresh={refresh}
					ids={modifyDataId}
				/>
			)}
			{modifyPasswordVisible && (
				<ModfyPassword
					visible={modifyPasswordVisible}
					id={modifyPasswordId}
					onClose={() => setModifyPasswordVisible(false)}
				/>
			)}
			{signModalVisible && (
				<SignListModel
					visible={signModalVisible}
					initialValues={signValues}
					title={`${signValues?.name}签名记录`}
					onClose={() => setSignModalVisible(false)}
				/>
			)}

			<Modal
				title="敏感操作，请完成管理员登录密码校验"
				width={400}
				open={isModalOpen}
				onCancel={handleOk}
				footer={null}
			>
				<div className="flex">
					<Input
						placeholder="请输入登录密码"
						value={pwd}
						onChange={(e) => setPwd(e.target.value)}
					/>
					<Button type="primary" className="ml10" onClick={() => checkP12Pwd()}>
						查看
					</Button>
				</div>
				{p12pwd && (
					<div className="fs12">
						P12证书密码： <Tag>{p12pwd}</Tag>{" "}
						<Button type="link" onClick={() => copyToClipboard(p12pwd)}>
							复制
						</Button>
					</div>
				)}
			</Modal>
		</React.Fragment>
	);
};

export default Merchants;
