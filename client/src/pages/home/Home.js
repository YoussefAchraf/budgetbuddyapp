import Lottie from 'react-lottie';
import React, { useState, useEffect } from 'react';
import Styles from "./Home.module.css";
const Home = ( ) => {
  const [animationData, setAnimationData] = useState(null);

    useEffect(() => {
        const fetchAnimationData = async () => {
            try {
                const response = await fetch(
                    'https://lottie.host/39132c70-564d-4703-b671-4b906d31d84c/geGxS1DLPd.json'
                );
                const data = await response.json();
                setAnimationData(data);
            } catch (error) {
                console.error('Error fetching animation data:', error);
            }
        };

        fetchAnimationData();
    }, []);

    if (!animationData) {
        return <div>Loading animation...</div>;
    }

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
        }
};
  return(
    <section className={Styles.Home}>
      <div className={Styles.Intro}>
        <h1 className={Styles.BbHeading}>Welcome to BudgetBuddy</h1>
        <p className={Styles.BbDesc}>
        Your personal finance companion, designed to simplify budgeting and expense tracking. With BudgetBuddy, users can easily set budgets, track expenses, and gain valuable insights into their spending habits. By providing a user-friendly interface and powerful features, BudgetBuddy empowers individuals to take control of their finances and achieve their financial goals with confidence."

Feel free to adjust it to better fit your project's specific features and goals!
        </p>
      </div>
      <div className={Styles.IntroLott}>
      <Lottie options={defaultOptions} height={400} width={400} />
      </div>
    </section>
  );
}
export default Home;