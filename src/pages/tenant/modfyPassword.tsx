import {
	message,
} from "antd";
import React from "react";
import { userApi } from "~/api";
import InfoModal, {
	type GenerateFormValues,
	type InfoModalFieldType,
} from "~/components/InfoModal";

interface ModalProps  {
    visible: boolean;
    onClose: () => void;
    initialValues?: Record<string, unknown>;
    id?: number;
    children?: React.ReactElement;
  };
const ModfyPassword: React.FC<ModalProps> = ({
    visible,
    onClose,
    id
}) => {
	//修改密码
	const modifyPasswordFields:InfoModalFieldType[] = [
		{
			name: "newPassword",
			label: "新密码",
			type: "input",
			span: 24,
			rules: [{ required: true, message: "新密码不能为空" }],
		},
	]

	const modifyPasswordSubmit = async (values: GenerateFormValues<typeof modifyPasswordFields>) => {
		values.id = id;
		const { code, message: msg} = await userApi.updatePassword(values  as ApiType.User.UpdatePassword) as ApiType.Response.Res<any>;

		if (code === 200) {
			message.success(msg) 
            onClose();
			return;
		}
		message.warning(msg);
	}


	return (
		<React.Fragment>
			<InfoModal<typeof modifyPasswordFields>
				fields={modifyPasswordFields}
				visible={visible}
				onSubmit={modifyPasswordSubmit}
				width={500}
                title={"修改密码"}
				onClose={onClose}
			/>
		</React.Fragment>
	);
};

export default ModfyPassword;
