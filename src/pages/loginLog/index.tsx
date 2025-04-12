import { useAntdTable } from "ahooks";
import { Card, Form, Table, type TableProps } from "antd";
import dayjs from "dayjs";
import { loginLogApi } from "~/api";
import QueryForm, { type QueryFormField } from "~/components/QueryForm";
import { toBeijingTime } from "~/utils";

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

const LoginLog = () => {
	const [form] = Form.useForm();
	const { tableProps, search, data } = useAntdTable(getTableData, {
		defaultPageSize: 10,
		form,
	});

	// * 数据表格项
	const tableColumns: TableProps<ApiType.LoginLog.Info>["columns"] = [
		{
			title: "序号",
			dataIndex: "id",
			key: "id",
			width: 80,
			align: "center",
		},
		{
			title: "商户名称",
			dataIndex: "tenantName",
			key: "tenantName",
			align: "center",
		},
		{
			title: "商户账号",
			dataIndex: "account",
			key: "account",
			align: "center",
		},
		{
			title: "登录时间",
			dataIndex: "createdAt",
			key: "createdAt",
			align: "center",
			render: (text) =>
				text ? toBeijingTime(text) : "-",
		},
		{
			title: "登录IP",
			dataIndex: "clientIp",
			key: "clientIp",
			align: "center",
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
		},
	];

	async function getTableData(
		{ current, pageSize }: UtilType.AhookRequestParam,
		formData: {
			name: string;
			dateRange: dayjs.Dayjs[];
		},
	): Promise<{
		total: number;
		list: ApiType.LoginLog.Info[];
	}> {
		const req: ApiType.LoginLog.Search = {
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

		const { total, records } = await loginLogApi.list(req);
		return {
			total,
			list: records,
		};
	}

	return (
		<div>
			<Card style={{ marginBottom: 20 }}>
				<QueryForm
					fields={queryFormFields}
					onSearch={search.submit}
					form={form}
					onReset={search.reset}
				/>
			</Card>

			<Card title="登录日志">
				<Table
					columns={tableColumns}
					{...tableProps}
					rowKey="id"
					pagination={{
						...tableProps.pagination,
						showSizeChanger: true,
						showTotal: () => `共 ${data?.total} 条`,
					}}
				/>
			</Card>
		</div>
	);
};

export default LoginLog;
