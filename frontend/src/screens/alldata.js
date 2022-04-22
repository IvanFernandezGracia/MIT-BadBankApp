import { Card } from "../components/card.js";
import { ItemUser } from "../components/itemUser.js";

export function AllData() {
  return (
    <>
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
                header="All Data in Store"
                style={{width:"100%"}}
                body={<ItemUser />}
                animateMount="  animate__animated animate__backInLeft "
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
