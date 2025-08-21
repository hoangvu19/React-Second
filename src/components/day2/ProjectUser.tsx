import React from "react";
import anh from "../../assets/img/OIP.webp";

interface User  {
	id:string;
	name: string;
	email: string;
	phone: string;
	avatarUrl?: string;
};


const ProjectUser = () => {
	const [user, setUser] = React.useState<User | null>(null);
	const [loading, setLoading] = React.useState(true);

	React.useEffect(() => {
		setTimeout(() => {
			setUser({
				id: "1",
				name: "Phạm Đức Hoàng Vũ",
				email: "vupham.190504@gmail.com",
				phone: "0898197946",
				avatarUrl: anh
			});
			setLoading(false);
		}, 2000);
	}, []);

	if (loading) {
		return <div>Loading...</div>;
	}
	if (!user) return null;
	return (
		<div className="user-card">
			<img
				src={user.avatarUrl || anh}
				alt={user.name}
			/>
			<div>
				<h3>{user.name}</h3>
				<p>{user.email}</p>
				<p>{user.phone}</p>
			</div>
		</div>
	);
};

export default ProjectUser;
