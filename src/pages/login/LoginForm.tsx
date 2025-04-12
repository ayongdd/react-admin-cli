import { Key, User } from "@icon-park/react";
import { Button, Form, type FormProps, Input, message } from "antd";
import { createStyles } from "antd-style";
import { useSetAtom } from "jotai";
import type React from "react";
import { useNavigate } from "react-router";
import { authApi } from "~/api";
import { authJotai } from "~/store";

const useStyles = createStyles(() => {
	return {
		loginForm: {
			marginBottom: "0",
		},
	};
});

const LoginForm: React.FC = () => {
	const { styles } = useStyles();
	const [form] = Form.useForm();
	const navigate = useNavigate();
	const setToken = useSetAtom(authJotai.tokenAtom);
	const setAuthInfo = useSetAtom(authJotai.authInfoAtom);
	const setPerms = useSetAtom(authJotai.permAtom);

	const handleLogin: FormProps<ApiType.Auth.Login>["onFinish"] = async (
		values,
	) => {
		try {
			const tokenVal = await authApi.login(values);
			tokenVal.tokenTime = Date.now();
			setToken(tokenVal);
			const authInfo = await authApi.getInfo();
			await setAuthInfo(authInfo);
			const shouldNavigateToAdmin = authInfo?.is_root;
			if (shouldNavigateToAdmin) {
				setPerms([
					"home",
					"system",
					"tenant",
					"tenant:index",
					"loginLog:index",
					"profile",
					"system:account",
					"system:perm",
					"system:log",
					"system:user",
					"system:tenant",
				]);
			} else {
				setPerms([
					"home",
					"system",
					"profile",
					"system:account",
					"system:perm",
					"system:log",
					"system:user",
					"system:tenant",
					"sign",
					"sign:index",
					"sign:add",
				]);
			}
			setTimeout(() => {
				navigate(authInfo?.is_root ? "/tenant/index" : "/sign/add", {
					replace: true,
				});
			}, 100);
			message.success("登录成功");
		} catch (error) {
			message.error("登录失败");
		}
	};

	return (
		<div style={{ minWidth: "300px" }}>
			<h2>商户管理系统</h2>
			<Form
				name="login"
				form={form}
				autoComplete="off"
				onFinish={handleLogin}
				className={styles.loginForm}
			>
				<Form.Item
					name="account"
					rules={[{ required: true, message: "请输入账号" }]}
				>
					<Input
						placeholder="请输入账号"
						prefix={<User theme="outline" size="16" fill="#333" />}
					/>
				</Form.Item>
				<Form.Item
					name="password"
					rules={[{ required: true, message: "请输入密码" }]}
				>
					<Input.Password
						placeholder="请输入密码"
						prefix={<Key theme="outline" size="16" fill="#333" />}
					/>
				</Form.Item>
				<Button type="primary" htmlType="submit" style={{ width: "100%" }}>
					登录
				</Button>
			</Form>
		</div>
	);
};

export default LoginForm;
