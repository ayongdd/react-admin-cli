import { useAntdTable } from "ahooks";
import {
	Button,
	Card,
	Form,
	message,
	Modal,
	Space,
	Table,
	type TableProps,
} from "antd";
import dayjs from "dayjs";
import { signApi } from "~/api";
import QueryForm, { type QueryFormField } from "~/components/QueryForm";
import { getUserInfo, toBeijingTime } from "~/utils";

interface ModalProps {
	visible: boolean;
	onClose: () => void;
	initialValues?: Record<string, unknown>;
	title?: string;
	isadd?: boolean;
	children?: React.ReactElement;
}

const queryFormFields: QueryFormField[] = [
	{
		name: "dateRange",
		label: "签名时间",
		type: "dateRange",
	},
];

const SignListModel: React.FC<ModalProps> = ({
	visible,
	initialValues,
	title,
	isadd,
	onClose,
}) => {
	const [form] = Form.useForm();
	// * 数据表格项
	const tableColumns: TableProps<ApiType.Tenant.Info>["columns"] = [
		{
			title: "商户ID",
			dataIndex: "tenantId",
			key: "tenantId",
			fixed: "left",
			align: "center",
			width: 80,
			// render: (text) => <a>{text}</a>,
		},
    {
			title: "应用名称",
			dataIndex: "bundleName",
			key: "bundleName",
		},
		{
			title: "签名IP",
			dataIndex: "clientIp",
			key: "clientIp",
			hidden: isadd,
		},
		{
			title: "IP归属地",
			dataIndex: "clientAddress",
			key: "clientAddress",
			render: (text: string) => {
				const t = text
					.split("|")
					.filter((t) => t !== "0")
					.join(" ");

				return <span>{t}</span>;
			},
			hidden: isadd,
		},
		{
			title: "签名时间",
			dataIndex: "createdAt",
			key: "createdAt",
			render: (text) => (
				<span>{toBeijingTime(text)}</span>
			),
		},
		{
			title: "原始BID",
			dataIndex: "newBundleId",
			key: "newBundleId",
		},
		{
			title: "签名后BID",
			dataIndex: "bundleId",
			key: "bundleId",
		},
    {
			title: "上传IPA版本号",
			dataIndex: "bundleVersion",
			key: "bundleVersion",
		},
		{
			title: "操作",
			key: "action",
			fixed: "right",
			align: "center",
			render: (_, record) => (
				<Space size={5}>
					<Button
						color="blue"
						variant="link"
						onClick={() =>
							(record?.id || JSON.stringify(record.id) === "0") &&
							download(record.id)
						}
					>
						下载
					</Button>
				</Space>
			),
		},
	];

	const getTableData = async (
		{ current, pageSize }: UtilType.AhookRequestParam,
		formData: {
			dateRange: dayjs.Dayjs[];
		},
	): Promise<{
		total: number;
		list: ApiType.Tenant.Info[];
	}> => {
		let tenantId = "";
		if (isadd) {
			tenantId =
				(getUserInfo() as ApiType.User.Info)?.tenant_id?.toString() ?? "";
		} else {
			tenantId = initialValues?.id?.toString() ?? "";
		}
		const req: ApiType.Sign.Search = {
			tenantId: tenantId ? Number(tenantId) : 0,
			page: current,
			pageSize,
		};
		if (formData.dateRange?.length === 2) {
			req.tsStart = formData.dateRange[0].format();
			req.tsEnd = formData.dateRange[1].format();
		}
		const { total, records } = await signApi.list(req);
		return {
			total,
			list: records,
		};
	};
	const { tableProps, data, search } = useAntdTable(getTableData, {
		defaultPageSize: 10,
		form,
	});

	const download = async (id: number) => {
		console.log("getDownloadUrl", initialValues);
		const url = await signApi.getDownloadUrl(
			id.toString(),
			initialValues?.id?.toString(),
		);
		if (!url) {
			message.error("获取链接失败");
			return;
		}
		const a = document.createElement<"a">("a");
		a.href = url;
		a.download = url;
		a.style.display = "none";
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
	};

	return (
		<Modal
			title={
				isadd
					? `${(getUserInfo() as ApiType.User.Info)?.tenant_name}签名记录`
					: title
			}
			open={visible}
			width={1400}
			destroyOnClose
			onCancel={onClose}
			maskClosable={false}
			footer={null}
			style={{
				top: 30,
			}}
		>
			<Card style={{ marginBottom: 10 }}>
				<QueryForm
					fields={queryFormFields}
					onSearch={search.submit}
					form={form}
					onReset={search.reset}
				/>
			</Card>
			<Card>
				<Table
					columns={tableColumns}
					{...tableProps}
					scroll={{ x: 800 }}
					rowKey="id"
					pagination={{
						...tableProps.pagination,
						showSizeChanger: true,
						showTotal: () => `共 ${data?.total} 条`,
					}}
				/>
			</Card>
		</Modal>
	);
};

export default SignListModel;
