import { HomeOutlined } from '@ant-design/icons';
import {
  Button,
  Checkbox,
  Descriptions,
  Form,
  Input,
  Modal,
  Typography,
} from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import stayAtHomeLottieJson from 'src/assets/lotties/stay-at-home.json';
import NewRequestIcon from 'src/assets/new-request-icon.svg';
import LoadingIndicator from 'src/components/LoadingIndicator/LoadingIndicator';
import TitleWithAddon from 'src/components/TitleWithAddon/TitleWithAddon';
import styled from 'styled-components';

import { DEVICE_MAX } from '../../constants/mediaQueries';
import { COLORS } from '../../theme/colors';

const { Text } = Typography;

const MainDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const FormDiv = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StyledForm = styled(Form)`
  width: 100%;
`;

const ConsentAndSubmitDiv = styled.div`
  display: block;
  text-align: center;
`;

const SubmitButton = styled(Button)`
  background-color: ${COLORS.secondary};
  border-color: ${COLORS.secondary};
  :hover {
    background-color: ${COLORS.secondaryHover};
    border-color: ${COLORS.secondaryHover};
  }
  :focus {
    background-color: ${COLORS.secondaryHover};
    border-color: ${COLORS.secondaryHover};
  }
  @media ${DEVICE_MAX.tablet} {
    height: 3.2em;
    background-color: ${COLORS.secondary} !important;
  }
`;

const Footer = styled.div`
  background-color: ${COLORS.grey};
  padding: 1em 1em;
  text-align: center;
  margin: 0 -24px -24px;
`;

const OrangeP = styled(Text)`
  color: ${COLORS.highlight};
`;

const SubtitleP = styled(Text)`
  font-size: 1.1em;
  font-weight: 600;
  text-align: center;
`;

const RememberInfoP = styled.p`
  margin-top: 0.5em;
`;

const NewRequestModal: React.FC<NewRequestModalProps> = ({
  showModal,
  closeModal,
  createRequest,
  loading,
  success,
}) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  // // eslint-disable-next-line no-unused-vars
  // const handleSubmit = value => {
  //   setLoading(true);

  //   setTimeout(() => {
  //     setLoading(false);
  //     setSuccess(true);
  //   }, 1500);
  // };

  const FormContent = (
    <MainDiv>
      <FormDiv>
        <TitleWithAddon alignAddon="left" level={2}>
          {t('newRequest.title')}
        </TitleWithAddon>
        <Descriptions>
          <Descriptions.Item>
            <HomeOutlined
              style={{
                paddingRight: '10px',
                paddingTop: '10px',
                fontSize: '1rem',
              }}
            />
            No. 18, Wantang Road, Xihu District, Hangzhou, Zhejiang, China
          </Descriptions.Item>
        </Descriptions>
        {/* There is a bug with types regarding onFinish - apparently an issue with @types and antd types
        https://github.com/ant-design/ant-design/pull/21067 - If it's not please fix *.* */}
        <StyledForm
          layout="vertical"
          form={form}
          onFinish={values => {
            createRequest(values.title, values.body, values.consent);
          }}
        >
          <Form.Item name="title" label={t('newRequest.form.title')}>
            <Input placeholder={t('newRequest.form.title')} />
          </Form.Item>
          <Form.Item name="body" label={t('newRequest.form.body')}>
            <Input.TextArea placeholder={t('newRequest.form.body')} />
          </Form.Item>
          <ConsentAndSubmitDiv>
            <Form.Item valuePropName="checked" name="consent">
              <Checkbox>{t('newRequest.form.consent')}</Checkbox>
            </Form.Item>
            <Form.Item>
              <SubmitButton htmlType="submit" type="primary">
                {t('newRequest.form.submit')}
              </SubmitButton>
            </Form.Item>
          </ConsentAndSubmitDiv>
        </StyledForm>
      </FormDiv>
    </MainDiv>
  );

  // TODO replace loading with the loading animation
  const LoadingContent = <h3>Submitting wait a second!</h3>;

  const SuccessContent = (
    <>
      <TitleWithAddon level={1}>{t('newRequestSuccess.title')}</TitleWithAddon>
      <SubtitleP>{t('newRequestSuccess.info')}</SubtitleP>
      <LoadingIndicator lottieJson={stayAtHomeLottieJson} />
      <Footer>
        <OrangeP>{t('newRequestSuccess.remember')}</OrangeP>
        <RememberInfoP>{t('newRequestSuccess.remember_info')}</RememberInfoP>
      </Footer>
    </>
  );

  return (
    <Modal
      style={{ top: '64px', padding: 0 }}
      visible={showModal}
      onCancel={closeModal}
      footer={null}
    >
      <NewRequestIconImage src={NewRequestIcon} />
      <TextOutlined>
        <Text>{t('newRequest.icon_text')}</Text>
      </TextOutlined>
      {loading && LoadingContent}
      {!loading && success && SuccessContent}
      {!loading && !success && FormContent}
    </Modal>
  );
};

const TextOutlined = styled.div`
  position: relative;
  top: -36px;
  text-align: center;

  span {
    color: #ff7b02;
    border: 1px solid #ff7b02;
    background: rgba(255, 123, 2, 0.1);
    padding: 5px;
  }
`;

const NewRequestIconImage = styled.img`
  display: block;
  position: relative;
  top: -46px;
  height: 100px;
  margin: 0 auto;
`;

interface NewRequestModalProps {
  showModal: boolean;
  closeModal: () => void;
  createRequest: Function;
  loading: boolean;
  success: boolean;
  error?: Error;
}

export default NewRequestModal;
