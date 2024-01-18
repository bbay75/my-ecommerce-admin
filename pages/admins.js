import Layout from "@/components/Layout";
import Spinner from "@/components/Spinner";
import { prettyDate } from "@/lib/date";
import axios from "axios";
import { useEffect, useState } from "react";
import { withSwal } from "react-sweetalert2";

function AdminsPage({ swal }) {
  const [email, setEmail] = useState("");
  const [adminEmails, setAdminEmails] = useState([]);
  const [isloading, setIsLoading] = useState(false);
  function addAdmin(ev) {
    ev.preventDefault();
    axios
      .post("/api/admins", { email })
      .then((res) => {
        console.log(res.data);
        swal.fire({
          title: "Admin created!",
          icon: "success",
        });
        setEmail("");
        loadAdmins();
      })
      .catch((err) => {
        swal.fire({
          title: "Error!",
          text: err.response.data.message,
          icon: "error",
        });
      });
  }
  function deleteAdmin(_id, email) {
    swal
      .fire({
        title: "Та зөвшөөрч байна уу?",
        text: `Та ${email} админыг устгахыг зөвшөөрч байна уу? `,
        showCancelButton: true,
        cancelButtonText: "Цуцлах",
        confirmButtonText: "Тийм ээ, устга!",
        confirmButtonColor: "#d55",
        reverseButtons: true,
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          axios.delete("/api/admins?_id=" + _id).then(() => {
            swal.fire({
              title: "Амжилттай устгагдлаа!",
              icon: "success",
            });
            loadAdmins();
          });
        }
      });
  }
  function loadAdmins() {
    setIsLoading(true);
    axios.get("/api/admins").then((res) => {
      setAdminEmails(res.data);
      setIsLoading(false);
    });
  }
  useEffect(() => {
    loadAdmins();
  }, []);
  return (
    <Layout>
      <h1>Админууд</h1>
      <h2>Шинээр админ нэмнэ үү</h2>

      <form onSubmit={addAdmin}>
        <div className="flex gap-2">
          <input
            type="text"
            className="mb-0"
            value={email}
            onChange={(ev) => setEmail(ev.target.value)}
            placeholder="google email"
          />
          <button type="submit" className="btn-primary py-1 whitespace-nowrap">
            Админ нэмнэх
          </button>
        </div>
      </form>

      <h2>Одоо байгаа админууд</h2>
      <table className="basic">
        <thead>
          <tr>
            <th className="text-left">Админ google email</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {isloading && (
            <tr>
              <td colSpan={2}>
                <div className="py-4">
                  <Spinner fullWidth={true} />
                </div>
              </td>
            </tr>
          )}
          {adminEmails.length > 0 &&
            adminEmails.map((adminEmail) => (
              <tr key={adminEmail._id}>
                <td>{adminEmail.email}</td>
                <td>
                  {adminEmail.createdAt && prettyDate(adminEmail.createdAt)}
                </td>
                <td>
                  <button
                    onClick={() =>
                      deleteAdmin(adminEmail._id, adminEmail.email)
                    }
                    className="btn-red"
                  >
                    УСТГАХ
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </Layout>
  );
}
export default withSwal(({ swal }) => <AdminsPage swal={swal} />);
