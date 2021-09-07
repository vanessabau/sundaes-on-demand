import Container from "react-bootstrap/Container";
import OrderEntry from "./pages/OrderEntry";
import { OrderDetailsProvider } from "./contexts/OrderDetails";

function App() {
  return (
    <Container>
      <OrderDetailsProvider>
        {/* Summary page and entry page need provider*/}
        <OrderEntry />
        {/* confirmation page does not need provider */}
      </OrderDetailsProvider>
    </Container>
  );
}

export default App;
