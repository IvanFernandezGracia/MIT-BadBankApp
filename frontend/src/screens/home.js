import { Card } from "../components/card.js";
import homeLogo from "../assets/images/bank.png";

export function Home() {
  return (
    <div className="container">
      <div className="row">
        <div className="col-12">
          <div
            style={{
              justifyContent: "center",
              margin: "auto",
              display: "flex",
            }}
          >
            <Card
              txtcolor="black"
              header="BadBank Landing Module"
              title="Welcome to the bank"
              text="You can move around using the navigation bar."
              body={
                <img src={homeLogo} className="img-fluid" alt="Responsive" />
              }
              shadowBorder="shadowCard"
              animateMount="  animate__animated animate__backInLeft "
            />
          </div>
        </div>
      </div>
    </div>
  );
}
