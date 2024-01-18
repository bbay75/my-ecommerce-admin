import { useEffect, useState } from "react";
import axios from "axios";
import Spinner from "@/components/Spinner";
import { subHours } from "date-fns";

export default function HomeStats() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    setIsLoading(true);
    axios.get("/api/orders").then((res) => {
      setOrders(res.data);
      setIsLoading(false);
    });
  }, []);

  function ordersTotal(orders) {
    let sum = 0;
    orders.forEach((order) => {
      const { line_items } = order;
      line_items.forEach((li) => {
        const lineSum = (li.quantity * li.price_data.unit_amount) / 100;
        sum += lineSum;
      });
    });
    console.log({ orders });
    return new Intl.NumberFormat("mo-MN").format(sum);
  }

  if (isLoading) {
    return (
      <div className="my-4">
        <Spinner fullWidth={true} />
      </div>
    );
  }

  const ordersToday = orders.filter(
    (o) => new Date(o.createdAt) > subHours(new Date(), 24)
  );
  const ordersWeek = orders.filter(
    (o) => new Date(o.createdAt) > subHours(new Date(), 24 * 7)
  );
  const ordersMonth = orders.filter(
    (o) => new Date(o.createdAt) > subHours(new Date(), 24 * 30)
  );

  return (
    <div>
      <h2>Захиалга</h2>
      <div className="tiles-grid">
        <div className="tile">
          <h3 className="tile-header">Өнөөдөр</h3>
          <div className="tile-number">{ordersToday.length}</div>
          <div className="tile-desc">
            өнөөдөрийн захиалга {ordersToday.length}
          </div>
        </div>
        <div className="tile">
          <h3 className="tile-header">Энэ долоо хоногт</h3>
          <div className="tile-number">{ordersWeek.length}</div>
          <div className="tile-desc">
            энэ долоо хоногийн захиалга {ordersWeek.length}
          </div>
        </div>
        <div className="tile">
          <h3 className="tile-header">Энэ сард</h3>
          <div className="tile-number">{ordersMonth.length}</div>
          <div className="tile-desc">
            энэ сарын захиалга {ordersMonth.length}
          </div>
        </div>
      </div>
      <h2>Орлого</h2>
      <div className="tiles-grid">
        <div className="tile">
          <h3 className="tile-header">Өнөөдөр</h3>
          <div className="tile-number">{ordersTotal(ordersToday)} ₮</div>
          <div className="tile-desc">
            өнөөдөрийн захиалга {ordersToday.length}
          </div>
        </div>
        <div className="tile">
          <h3 className="tile-header">Энэ долоо хоногт</h3>
          <div className="tile-number">{ordersTotal(ordersWeek)} ₮</div>
          <div className="tile-desc">
            энэ долоо хоногийн захиалга {ordersWeek.length}
          </div>
        </div>
        <div className="tile">
          <h3 className="tile-header">Энэ сард</h3>
          <div className="tile-number">{ordersTotal(ordersMonth)} ₮</div>
          <div className="tile-desc">
            энэ сарын захиалга {ordersMonth.length}
          </div>
        </div>
      </div>
    </div>
  );
}
