import React from 'react';
import { Button, Result } from 'antd';
import { useNavigate } from 'react-router';
import styled from 'styled-components';
import { isAdmin } from '~/utils';

const StyledWrapper = styled.div`
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;

  .ant-result {
    padding: 48px 32px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  }

  .ant-result-subtitle {
    color: #666;
  }

  .buttons {
    display: flex;
    gap: 12px;
    justify-content: center;
  }
`;

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  const handleHome = () => {
    navigate(isAdmin() ? '/tenant/index' : '/sign/add');
  };

  return (
    <StyledWrapper>
      <Result
        status="404"
        title="404"
        subTitle="抱歉，您访问的页面不存在"
        extra={
          <div className="buttons">
            <Button onClick={handleHome}>
              回到首页
            </Button>
          </div>
        }
      />
    </StyledWrapper>
  );
};

export default NotFound;
