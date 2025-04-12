import { Button, Col, Form, Input, message, Modal, type UploadFile } from "antd";
import React, { useEffect, useMemo, useState } from "react";
import { tenantApi } from "~/api";
import InfoModal, {
	type GenerateFormValues,
	type InfoModalFieldType,
} from "~/components/InfoModal";
import { toBeijingTime } from "~/utils";

interface ModalProps {
	visible: boolean;
	onClose: () => void;
	refresh: () => void;
	ids: number | null | undefined;
	children?: React.ReactElement;
}

const EditForm: React.FC<ModalProps> = ({ onClose, refresh, ids }) => {
  const [key, setKey] = useState(0);
  const [bidkey, setBidKey] = useState(0);
  const [p12Bidkey, setP12Bidkey] = useState(0);
  const [p12File, setP12File] = useState<UploadFile>();
  const [mobileFile, setMobileFile] = useState<UploadFile>();
  const [initialValues, setInitialValues] = useState<ApiType.Tenant.Info>();
  const [bid, setBid] = useState<{bid: string, expiry: string}>();
  const [p12Bid, setP12Bid] = useState<{bid: string, expiry: string}>();
  const p12FileList = useMemo(() => (p12File ? [p12File] : []), [p12File]);
  const mobileFileList = useMemo(() => (mobileFile ? [mobileFile] : []), [mobileFile]);

  const [isModalOpen, setIsModalOpen] = useState(false);
	const [pwd, setPwd] = useState<string>();
  
  const infoFields: InfoModalFieldType[] = [
    {
      name: "name",
      label: "商户名称",
      type: "input",
      rules: [{ required: true, message: "商户名称不能为空" }],
    },
    {
      name: "id",
      label: "商户ID",
      type: "input",
      readonly: true,
      // placeText: "创建后自动生成",
      disabled: true,
      rules: [{ required: true, message: "商户ID不能为空" }],
    },
    {
      name: "account",
      label: "登录账号",
      type: "input",
      rules: [{ required: true, message: "登录账号不能为空" }],
    },
    // {
    //   name: "p12CertPassword",
    //   label: "P12证书密码",
    //   type: "input",
    //   rules: [{ required: true, message: "P12证书密码不能为空" }],
    // },
    {
      name: "mobileProvision",
      label: "Mobile证书",
      type: "inputUpload",
      props: {
        accept: ".mobileprovision",
      },
      onChange: async (info) => {
        if (
          info.file.status === "removed" ||
          info.file.status === "uploading"
        ) {
          return;
        }
        setMobileFile(info.file);
        const { code, data, message: msg} = await tenantApi.getBid(info.file);
        if (code === 200) {
          setBidKey((prev) => prev + 1);
          setKey((prev) => prev + 1);
          setBid(data);
          return;
        }
        message.warning(msg);
      },
      onRemove: () => {
        setBid({ bid: "", expiry: ""});
        setMobileFile(undefined);
        setKey((prev) => prev + 1);
        setBidKey((prev) => prev + 1);
        return true;
      },
      beforeUpload: () => false,
      key: key, // 强制重新渲染
      fileList: mobileFileList,
      rules: [{ required: true, message: "Mobile证书不能为空" }],
    },
    {
      name: "p12Cert",
      label: "P12证书",
      type: "inputUpload",
      props: {
        accept: ".p12",
      },
      onChange: async (info) => {
        if (
          info.file.status === "removed" ||
          info.file.status === "uploading"
        ) {
          return;
        }
        setPwd("");
        setP12File(info.file);
        setIsModalOpen(true);
      },
      onRemove: () => {
        setP12Bid({ bid: "", expiry: ""});
        setP12File(undefined);
        setP12Bidkey((prev) => prev + 1);
        return true;
      },
      beforeUpload: () => {
        return false;
      },
      key: key, // 强制重新渲染
      fileList: p12FileList,
      rules: [{ required: true, message: "P12证书不能为空" }],
    },
  ];
  const addInfoFields: InfoModalFieldType[] = [
    {
      name: "name",
      label: "商户名称",
      type: "input",
      rules: [{ required: true, message: "商户名称不能为空" }],
    },
    {
      name: "account",
      label: "登录账号",
      type: "input",
      rules: [{ required: true, message: "登录账号不能为空" }],
    },
    {
      name: "password",
      label: "登录密码",
      type: "input",
      rules: [{ required: true, message: "登录密码不能为空" }],
    },
    {
      name: "mobileProvision",
      label: "Mobile证书",
      type: "inputUpload",
      props: {
        accept: ".mobileprovision",
      },
      onChange: async (info) => {
        setMobileFile(info.file);
        const { code, data, message: msg} = await tenantApi.getBid(info.file);
        if (code === 200) {
          setBidKey((prev) => prev + 1);
          setKey((prev) => prev + 1);
          setBid(data);
          return;
        }
        message.warning(msg)
      },
      onRemove: ()=> {
        setBid({ bid: "",expiry: ""});
        setMobileFile(undefined);
        setBidKey((prev) => prev + 1);
      },
      beforeUpload: () => false,
      key: key, // 强制重新渲染
      fileList: mobileFileList,
      rules: [{ required: true, message: "Mobile证书不能为空" }],
    },
    {
      name: "p12Cert",
      label: "P12证书",
      type: "inputUpload",
      props: {
        accept: ".p12",
      },
      onChange: async (info) => {
        if (
          info.file.status === "removed" ||
          info.file.status === "uploading"
        ) {
          return;
        }
        setPwd("");
        setP12File(info.file);
        setIsModalOpen(true);
      },
      onRemove: ()=> {
        setP12Bid({ bid: "", expiry: ""})
        setP12File(undefined);
        setP12Bidkey((prev) => prev + 1);
        return true;
      },
      beforeUpload: () => false,
      key: key, // 强制重新渲染
      fileList: p12FileList,
      rules: [{ required: true, message: "P12证书不能为空" }],
    },
  ];

  const checkP12Pwd = async () => {
    if (!pwd) return message.warning("请输入管理员登录密码");
    // if (!p12File) return message.warning("");
    const { code, data, message: msg} = await tenantApi.getCertInfo({ file: p12File,  p12Password: pwd});
    if (code === 200) {
      setP12Bidkey((prev) => prev + 1);
      setKey((prev) => prev + 1);
      setP12Bid(state=> ({
        ...(state || { bid: "", expiry: "" }),
        expiry: data
      }));
      setIsModalOpen(false)
      return;
    }
    message.warning(msg)
    setIsModalOpen(false)
	};
  const getFileName = (url: string) => {
    try {
      return url.split("/")[url.split("/").length - 1]
        ? url.split("/")[url.split("/").length - 1]
        : "文件";
    } catch (e) {
      return "文件";
    }
  };

  useEffect(() => {
    const getData = async (id: number) => {
      try {
        const res: ApiType.Tenant.Info = await tenantApi.info(id);
        setP12File({
          uid: "-1",
          name: getFileName(res.p12Cert),
          url: res.p12Cert,
          status: "done",
          thumbUrl: res.p12Cert,
        });
        setMobileFile({
          uid: "-2",
          name: getFileName(res.mobileProvision),
          status: "done",
          url: res.mobileProvision,
          thumbUrl: res.mobileProvision,
        });
        setBid((state) => ({
          ...(state || { bid: "", expiry: "" }),
          expiry: res?.provisionExpiry,
          bid: res?.provisionBundleId
        }));
        setP12Bid((state) => ({
          ...(state || { bid: "", expiry: "" }),
          expiry: res?.p12Expiry,
        }));
        setKey((prev) => prev + 1); // 强制重新渲染
        setBidKey((prev) => prev + 1)
        setP12Bidkey((prev) => prev + 1)
        setInitialValues(res);
      } catch (e) {
        message.warning("获取用户信息失败！")
      }
     
    };

		if (ids || JSON.stringify(ids) === "0") {
      const numericId = Number(ids);
			getData(numericId);
		}
	}, [ids]);

	const handleSubmitInfo = async (
		values: GenerateFormValues<typeof infoFields>,
	) => {
		let msg = "添加成功";
		values.id = Number(values.id);
		values.mobileProvision = "";
		values.p12Cert = "";
		if (p12File?.type === "application/x-pkcs12") {
			//判断文件
			values.p12Cert = p12File;
		}
		if (p12File?.url) {
			values.p12Cert = p12File?.url;
		}

		if (mobileFile?.type === "application/x-apple-aspen-mobileprovision") {
			//判断手机文件
			values.mobileProvision = mobileFile;
		}
		if (mobileFile?.url) {
			values.mobileProvision = mobileFile?.url;
		}
    values.p12CertPassword = pwd;
		if (ids || JSON.stringify(ids) === "0") {
			msg = "修改成功";
			await tenantApi.update(values as ApiType.Tenant.Info);
		} else {
			delete values?.id;
		  await tenantApi.create(values as ApiType.Tenant.Info);
		}
		message.success(msg);
		onClose();
		refresh();
	};

  return (
    <React.Fragment>
      <InfoModal<typeof infoFields>
        fields={!initialValues ? addInfoFields : infoFields}
        visible={true}
        onSubmit={handleSubmitInfo}
        initialValues={initialValues}
        onClose={onClose}
        title={initialValues ? "编辑商户" : "新增商户"}
      >
        <>
        <Col span={12} key={"expiry"}>
            <Form.Item name={"expiry"} label={"Mobile证书到期时间"} rules={[]}>
              <Input
                readOnly={true}
                disabled={true}
                key={bidkey}
                placeholder={"上传完mobile文件自动同步"}
                defaultValue={bid?.expiry &&  toBeijingTime(bid.expiry)}
                value={bid?.expiry && toBeijingTime(bid.expiry)}
              />
            </Form.Item>
          </Col>
          <Col span={12} key={"p12expiry"}>
            <Form.Item name={"expiry"} label={"P12证书到期时间"} rules={[]}>
              <Input
                readOnly={true}
                disabled={true}
                key={p12Bidkey}
                placeholder={"上传完P12文件自动同步"}
                defaultValue={p12Bid?.expiry && toBeijingTime(p12Bid.expiry)}
                value={p12Bid?.expiry && toBeijingTime(p12Bid.expiry) }
              />
            </Form.Item>
          </Col>
         
          <Col span={12} key={"bid"}>
            <Form.Item name={"bid"} label={"企业证书bid"} rules={[]}>
              <Input
                readOnly={true}
                disabled={true}
                key={bidkey}
                placeholder={"上传完mobile文件自动同步"}
                defaultValue={bid?.bid}
                value={bid?.bid}
              />
            </Form.Item>
          </Col>
        </>
      </InfoModal>

      <Modal
				title="输入p12证书密码获取证书到期时间"
				width={400}
				open={isModalOpen}
				onCancel={()=>setIsModalOpen(false)}
				footer={null}
			>
				<div className="flex">
					<Input
						placeholder="请输入登录密码"
						value={pwd}
						onChange={(e) => setPwd(e.target.value)}
					/>
					<Button type="primary" className="ml10" onClick={() => checkP12Pwd()}>
						确定
					</Button>
				</div>
			</Modal>
    </React.Fragment>
  );
};

export default EditForm;
