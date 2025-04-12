import React, { useState, useEffect } from 'react';
import { Card, Descriptions, Button, Form, Input, message, Avatar, Tabs } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import type { TabsProps } from 'antd';

const StyledWrapper = styled.div`
  padding: 24px;
  
  .profile-header {
    margin-bottom: 24px;
    background: white;
    border-radius: 8px;
    padding: 24px;
    
    .avatar-section {
      display: flex;
      align-items: center;
      gap: 24px;
      margin-bottom: 24px;
      
      .ant-avatar {
        width: 120px;
        height: 120px;
        line-height: 120px;
        font-size: 48px;
      }
      
      .user-info {
        h1 {
          margin: 0;
          font-size: 24px;
        }
        
        p {
          color: #666;
          margin: 8px 0 0;
        }
      }
    }
  }
  
  .ant-card {
    margin-bottom: 24px;
  }

  .form-section {
    max-width: 600px;
  }
`;

const Profile: React.FC = (): React.ReactNode => {
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('1');

  // 模拟用户数据
  const mockUserData = {
    username: 'admin',
    name: '管理员',
    email: 'admin@example.com',
    phone: '13800138000',
    role: '系统管理员',
    department: '技术部',
    lastLogin: '2024-03-20 10:30:00',
  };

  useEffect(() => {
    // 在实际应用中，这里会从API获取用户数据
    form.setFieldsValue(mockUserData);
  }, [form]);

  const handleUpdateProfile = async (values: any) => {
    setLoading(true);
    try {
      // 这里应该调用更新用户信息的API
      console.log('更新用户信息:', values);
      message.success('个人信息更新成功');
    } catch (error) {
      message.error('更新失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (values: any) => {
    setLoading(true);
    try {
      // 这里应该调用修改密码的API
      console.log('修改密码:', values);
      message.success('密码修改成功');
      passwordForm.resetFields();
    } catch (error) {
      message.error('修改失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: '基本信息',
      children: (
        <div className="form-section">
          <Form
            form={form}
            layout="vertical"
            onFinish={handleUpdateProfile}
          >
            <Form.Item
              name="name"
              label="姓名"
              rules={[{ required: true, message: '请输入姓名' }]}
            >
              <Input placeholder="请输入姓名" />
            </Form.Item>
            <Form.Item
              name="email"
              label="邮箱"
              rules={[
                { required: true, message: '请输入邮箱' },
                { type: 'email', message: '请输入有效的邮箱地址' }
              ]}
            >
              <Input placeholder="请输入邮箱" />
            </Form.Item>
            <Form.Item
              name="phone"
              label="手机号"
              rules={[
                { required: true, message: '请输入手机号' },
                { pattern: /^1\d{10}$/, message: '请输入有效的手机号' }
              ]}
            >
              <Input placeholder="请输入手机号" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading}>
                保存修改
              </Button>
            </Form.Item>
          </Form>
        </div>
      ),
    },
    {
      key: '2',
      label: '修改密码',
      children: (
        <div className="form-section">
          <Form
            form={passwordForm}
            layout="vertical"
            onFinish={handleUpdatePassword}
          >
            <Form.Item
              name="oldPassword"
              label="当前密码"
              rules={[{ required: true, message: '请输入当前密码' }]}
            >
              <Input.Password placeholder="请输入当前密码" />
            </Form.Item>
            <Form.Item
              name="newPassword"
              label="新密码"
              rules={[
                { required: true, message: '请输入新密码' },
                { min: 6, message: '密码长度不能小于6位' }
              ]}
            >
              <Input.Password placeholder="请输入新密码" />
            </Form.Item>
            <Form.Item
              name="confirmPassword"
              label="确认新密码"
              dependencies={['newPassword']}
              rules={[
                { required: true, message: '请确认新密码' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('newPassword') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('两次输入的密码不一致'));
                  },
                }),
              ]}
            >
              <Input.Password placeholder="请确认新密码" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading}>
                修改密码
              </Button>
            </Form.Item>
          </Form>
        </div>
      ),
    },
  ];

  return (
    <StyledWrapper>
      <div className="profile-header">
        <div className="avatar-section">
          <Avatar size={120} icon={<UserOutlined />} />
          <div className="user-info">
            <h1>{mockUserData.name}</h1>
            <p>{mockUserData.role} · {mockUserData.department}</p>
          </div>
        </div>
        <Descriptions column={2}>
          <Descriptions.Item label="用户名">{mockUserData.username}</Descriptions.Item>
          <Descriptions.Item label="邮箱">{mockUserData.email}</Descriptions.Item>
          <Descriptions.Item label="手机号">{mockUserData.phone}</Descriptions.Item>
          <Descriptions.Item label="上次登录">{mockUserData.lastLogin}</Descriptions.Item>
        </Descriptions>
      </div>

      <Card>
        <Tabs activeKey={activeTab} items={items} onChange={setActiveTab} />
      </Card>
    </StyledWrapper>
  );
};

export default Profile;
