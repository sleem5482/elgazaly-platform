import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { Card, CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { User, Phone, Lock, Save, Camera } from 'lucide-react';

export default function AdminSettings() {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        name: user?.name || '',
        phone: user?.phone || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        alert('تم حفظ التغييرات بنجاح');
    };

    return (
        <div className="flex min-h-screen bg-gray-100 font-sans">
            <AdminSidebar />
            <main className="flex-1 p-8 overflow-y-auto">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-secondary mb-2">إعدادات الأدمن</h1>
                    <p className="text-gray-600">تحكم في بيانات حسابك وكلمة المرور</p>
                </header>

                <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Profile Picture Card */}
                    <Card className="border-none shadow-md bg-white h-fit">
                        <CardContent className="p-8 flex flex-col items-center text-center">
                            <div className="relative mb-6 group cursor-pointer">
                                <div className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center text-primary text-4xl font-bold overflow-hidden border-4 border-white shadow-lg">
                                    {user?.name?.[0]}
                                </div>
                                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Camera size={24} />
                                </div>
                            </div>
                            <h2 className="text-xl font-bold text-dark mb-1">{user?.name}</h2>
                            <p className="text-gray-500 text-sm mb-4">مدير النظام</p>
                            <Button variant="outline" className="w-full rounded-xl border-primary text-primary hover:bg-primary hover:text-white">
                                تغيير الصورة
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Form Card */}
                    <Card className="lg:col-span-2 border-none shadow-md bg-white">
                        <CardContent className="p-8">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <section>
                                    <h3 className="text-lg font-bold text-dark mb-4 border-b border-gray-100 pb-2">البيانات الشخصية</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">الاسم بالكامل</label>
                                            <div className="relative">
                                                <User className="absolute right-3 top-3 text-gray-400" size={18} />
                                                <Input
                                                    className="pr-10"
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">رقم الهاتف</label>
                                            <div className="relative">
                                                <Phone className="absolute right-3 top-3 text-gray-400" size={18} />
                                                <Input
                                                    className="pr-10"
                                                    value={formData.phone}
                                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                <section>
                                    <h3 className="text-lg font-bold text-dark mb-4 border-b border-gray-100 pb-2 mt-8">كلمة المرور</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">كلمة المرور الحالية</label>
                                            <div className="relative">
                                                <Lock className="absolute right-3 top-3 text-gray-400" size={18} />
                                                <Input type="password" className="pr-10" placeholder="••••••••" />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">كلمة المرور الجديدة</label>
                                                <div className="relative">
                                                    <Lock className="absolute right-3 top-3 text-gray-400" size={18} />
                                                    <Input type="password" className="pr-10" placeholder="••••••••" />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">تأكيد كلمة المرور</label>
                                                <div className="relative">
                                                    <Lock className="absolute right-3 top-3 text-gray-400" size={18} />
                                                    <Input type="password" className="pr-10" placeholder="••••••••" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                <div className="pt-6 border-t border-gray-100 flex justify-end">
                                    <Button type="submit" className="bg-secondary hover:bg-secondary/90 text-white px-8 py-3 rounded-xl shadow-lg shadow-secondary/20 flex items-center gap-2">
                                        <Save size={18} />
                                        حفظ التغييرات
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}
