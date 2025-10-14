import { ToastContainer } from "react-toastify";
import DashboardLayout from "./DashboardLayout";

export const metadata = {
  title: "Admin Dashboard - britcartbd",
  description:
    "Manage products, categories, orders, and customers from the admin dashboard.",
};

export default function RootDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <DashboardLayout>
        {children}
        <ToastContainer
          position="bottom-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </DashboardLayout>
    </>
  );
}
