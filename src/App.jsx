import './App.css'

import React, { useState } from "react";
import {
    Layout,
    Menu,
    Card,
    Button,
    Row,
    Col,
    Pagination,
    Badge,
    Drawer,
    InputNumber,
    List,
    message,
} from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";

const { Header, Content, Footer } = Layout;

const PRODUCTS = [
    { id: 1, name: "Chicken Soup", price: 40, image: "https://picsum.photos/200?1" },
    { id: 2, name: "Pasta with Cheese", price: 55, image: "https://picsum.photos/200?2" },
    { id: 3, name: "Fresh Salad", price: 30, image: "https://picsum.photos/200?3" },
    { id: 4, name: "Apple Juice", price: 25, image: "https://picsum.photos/200?4" },
    { id: 5, name: "Chocolate Cake", price: 45, image: "https://picsum.photos/200?5" },
    { id: 6, name: "Sandwich", price: 35, image: "https://picsum.photos/200?6" },
    { id: 7, name: "Porridge", price: 20, image: "https://picsum.photos/200?7" },
    { id: 8, name: "Coffee", price: 30, image: "https://picsum.photos/200?8" },
    { id: 9, name: "Tea", price: 20, image: "https://picsum.photos/200?9" },
    { id: 10, name: "Pancakes", price: 50, image: "https://picsum.photos/200?10" },
];

function App() {
    const [cart, setCart] = useState({});
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [orders, setOrders] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [view, setView] = useState("home");

    const pageSize = 6;
    const startIndex = (currentPage - 1) * pageSize;
    const paginatedProducts = PRODUCTS.slice(startIndex, startIndex + pageSize);

    const addToCart = (product) => {
        setCart((prev) => ({
            ...prev,
            [product.id]: prev[product.id]
                ? { ...prev[product.id], quantity: prev[product.id].quantity + 1 }
                : { ...product, quantity: 1 },
        }));
        message.success(`${product.name} added to cart`);
    };

    const updateQuantity = (id, quantity) => {
        if (quantity <= 0) {
            const newCart = { ...cart };
            delete newCart[id];
            setCart(newCart);
        } else {
            setCart((prev) => ({ ...prev, [id]: { ...prev[id], quantity } }));
        }
    };

    const totalAmount = Object.values(cart).reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    const placeOrder = () => {
        if (Object.keys(cart).length === 0) {
            message.warning("Your cart is empty!");
            return;
        }
        const newOrder = {
            id: Date.now(),
            date: new Date().toLocaleString(),
            items: Object.values(cart),
            total: totalAmount,
        };
        setOrders([newOrder, ...orders]);
        setCart({});
        message.success("Order placed successfully!");
        setView("orders");
    };

    const menuItems = [
        { key: "home", label: "Home" },
        { key: "orders", label: "My Orders" },
    ];

    return (
        <Layout style={{ minHeight: "100vh" }}>
            {/* ---- HEADER ---- */}
            <Header
                style={{
                    background: "#fff",
                    padding: "0 24px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "nowrap", // ✅ забороняє перенос елементів
                    overflow: "hidden",
                }}
            >
                <Menu
                    mode="horizontal"
                    selectedKeys={[view]}
                    items={menuItems}
                    onClick={(e) => setView(e.key)}
                    style={{
                        flex: 1,
                        minWidth: "200px",
                        display: "flex",
                        justifyContent: "flex-start",
                        flexWrap: "nowrap",
                    }}
                />
                <Badge count={Object.keys(cart).length} size="small">
                    <Button
                        type="primary"
                        icon={<ShoppingCartOutlined />}
                        onClick={() => setIsCartOpen(true)}
                    >
                        Cart
                    </Button>
                </Badge>
            </Header>

            {/* ---- CONTENT ---- */}
            <Content
                style={{
                    padding: "24px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <div style={{ maxWidth: 1000, width: "100%" }}> {/* ✅ фіксована ширина */}
                    {view === "home" && (
                        <>
                            <h1>School Canteen Menu</h1>
                            <Row gutter={[16, 16]}>
                                {paginatedProducts.map((product) => (
                                    <Col xs={24} sm={12} md={8} lg={6} key={product.id}>
                                        <Card
                                            cover={<img alt={product.name} src={product.image} />}
                                            actions={[
                                                <Button type="primary" onClick={() => addToCart(product)}>
                                                    Add to Cart
                                                </Button>,
                                            ]}
                                        >
                                            <Card.Meta
                                                title={product.name}
                                                description={`Price: ₴${product.price}`}
                                            />
                                        </Card>
                                    </Col>
                                ))}
                            </Row>

                            <div style={{ marginTop: 20, textAlign: "center" }}>
                                <Pagination
                                    current={currentPage}
                                    pageSize={pageSize}
                                    total={PRODUCTS.length}
                                    onChange={(page) => setCurrentPage(page)}
                                />
                            </div>
                        </>
                    )}

                    {view === "orders" && (
                        <>
                            <h1>My Orders</h1>
                            {orders.length === 0 ? (
                                <p>You don't have any orders yet.</p>
                            ) : (
                                <List
                                    bordered
                                    dataSource={orders}
                                    renderItem={(order) => (
                                        <List.Item>
                                            <div style={{ width: "100%" }}>
                                                <b>Order #{order.id}</b> - {order.date}
                                                <br />
                                                {order.items.map((item) => (
                                                    <div key={item.id}>
                                                        {item.name} x {item.quantity} — ₴{item.price * item.quantity}
                                                    </div>
                                                ))}
                                                <b>Total: ₴{order.total}</b>
                                            </div>
                                        </List.Item>
                                    )}
                                />
                            )}
                        </>
                    )}
                </div>
            </Content>

            {/* ---- FOOTER ---- */}
            <Footer style={{ textAlign: "center" }}>
                © {new Date().getFullYear()} School Canteen. All rights reserved.
            </Footer>

            {/* ---- CART DRAWER ---- */}
            <Drawer
                title="Your Cart"
                placement="right"
                onClose={() => setIsCartOpen(false)}
                open={isCartOpen}
                width={350}
            >
                {Object.keys(cart).length === 0 ? (
                    <p>Your cart is empty</p>
                ) : (
                    <>
                        <List
                            dataSource={Object.values(cart)}
                            renderItem={(item) => (
                                <List.Item
                                    actions={[
                                        <InputNumber
                                            min={0}
                                            value={item.quantity}
                                            onChange={(val) => updateQuantity(item.id, val)}
                                        />,
                                    ]}
                                >
                                    <List.Item.Meta
                                        title={item.name}
                                        description={`₴${item.price} × ${item.quantity} = ₴${item.price * item.quantity}`}
                                    />
                                </List.Item>
                            )}
                        />
                        <h3>Total: ₴{totalAmount}</h3>
                        <Button type="primary" block onClick={placeOrder}>
                            Place Order
                        </Button>
                    </>
                )}
            </Drawer>
        </Layout>
    );
}

export default App;
