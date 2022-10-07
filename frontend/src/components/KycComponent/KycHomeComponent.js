import "../../style/KycPage.css"
import logo from "../../style/images/banner/first.jpg"
import { Steps } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import FirstForm from "../../components/KycComponent/FirstForm";
import SecondForm from "../../components/KycComponent/SecondForm";
import ThirdForm from "../../components/KycComponent/ThirdForm";
import axios from "axios";
const { Step } = Steps;

const KycHomeComponent = () => {

    const [current, setCurrent] = useState(0);

    // const next = () => {
    //     setCurrent(current + 1);
    // };

    // const prev = () => {
    //     setCurrent(current - 1);
    // };
    const callback = useCallback((count) => {
        setCurrent(count);
    }, []);

    const steps = [
        {
            title: 'Username',
            content: <FirstForm props={callback} />
        },
        {
            title: 'Reward',
            content: <SecondForm props={callback} />,
        },
        {
            title: 'Invest',
            content: <ThirdForm />,
        },
    ];

    useEffect(async () => {
        let token = localStorage.getItem('token')
        const headers = {
            'token': token,
        }
        await axios.get("auth/getCompletedStep", { headers: headers }).then((res) => {
            setCurrent(res.data.step)
        })
    }, [])

    return (
        <div className="kycContainer">
            <div className="kycHeader">
                <img src={logo} alt="logo" className="kycImage" />
                <div >Trading</div>
            </div>
            <div style={{ width: "85%", padding: "40px 0px 0px 180px" }}>
                <Steps current={current}>
                    {steps.map((item) => (
                        <Step key={item.title} title={item.title} />
                    ))}
                </Steps>
                <div className="steps-content">{steps[current].content}</div>
                {/* <div className="steps-action">
                    {current < steps.length - 1 && (
                        <Button type="primary" onClick={() => next()}>
                            Next
                        </Button>
                    )}
                    {current === steps.length - 1 && (
                        <Button type="primary" onClick={() => message.success('Processing complete!')}>
                            Done
                        </Button>
                    )}
                    {current > 0 && (
                        <Button style={{ margin: '0 8px' }} onClick={() => prev()}>
                            Previous
                        </Button>
                    )}
                </div> */}
            </div>

        </div>
    );
}

export default KycHomeComponent;
