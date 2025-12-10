import { Facebook, Youtube, Instagram, Phone, Mail, MapPin, Heart, Code } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="bg-white border-t border-gray-100 pt-12 md:pt-16 pb-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12 mb-8 md:mb-12">
                    {/* Brand Section */}
                    <div className="col-span-1 md:col-span-2">
                        <Link to="/" className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 md:mb-6 block">منصة الغزالي</Link>
                        <p className="text-sm md:text-base text-gray-500 leading-relaxed mb-4 md:mb-6 max-w-md">
                            منصة تعليمية رائدة تهدف إلى تيسير تعلم اللغة العربية للمرحلة الثانوية بأساليب حديثة ومبتكرة.
                            نحن هنا لنضمن تفوقك ووصولك إلى الدرجة النهائية.
                        </p>
                        <div className="flex gap-3 md:gap-4">
                            <a href="#" className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all">
                                <Facebook size={18} className="md:w-5 md:h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all">
                                <Youtube size={18} className="md:w-5 md:h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-pink-50 text-pink-600 flex items-center justify-center hover:bg-pink-600 hover:text-white transition-all">
                                <Instagram size={18} className="md:w-5 md:h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-green-50 text-green-600 flex items-center justify-center hover:bg-green-600 hover:text-white transition-all">
                                <Phone size={18} className="md:w-5 md:h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-bold text-base md:text-lg mb-4 md:mb-6 text-gray-900">روابط سريعة</h4>
                        <ul className="space-y-3 md:space-y-4">
                            <li><Link to="/" className="text-sm md:text-base text-gray-500 hover:text-primary transition-colors">الرئيسية</Link></li>
                            <li><Link to="/login" className="text-sm md:text-base text-gray-500 hover:text-primary transition-colors">تسجيل الدخول</Link></li>
                            <li><Link to="/register" className="text-sm md:text-base text-gray-500 hover:text-primary transition-colors">إنشاء حساب</Link></li>
                            <li><Link to="/grade/1" className="text-sm md:text-base text-gray-500 hover:text-primary transition-colors">الصف الأول الثانوي</Link></li>
                            <li><Link to="/grade/2" className="text-sm md:text-base text-gray-500 hover:text-primary transition-colors">الصف الثاني الثانوي</Link></li>
                            <li><Link to="/grade/3" className="text-sm md:text-base text-gray-500 hover:text-primary transition-colors">الصف الثالث الثانوي</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="font-bold text-base md:text-lg mb-4 md:mb-6 text-gray-900">تواصل معنا</h4>
                        <ul className="space-y-3 md:space-y-4">
                            <li className="flex items-center gap-2 md:gap-3 text-sm md:text-base text-gray-500">
                                <Phone size={16} className="md:w-[18px] md:h-[18px] text-primary flex-shrink-0" />
                                <span dir="ltr">+20 1xxxxxxxxx</span>
                            </li>
                            <li className="flex items-center gap-2 md:gap-3 text-sm md:text-base text-gray-500">
                                <Mail size={16} className="md:w-[18px] md:h-[18px] text-primary flex-shrink-0" />
                                <span className="break-all">info@alghazali.com</span>
                            </li>
                            <li className="flex items-center gap-2 md:gap-3 text-sm md:text-base text-gray-500">
                                <MapPin size={16} className="md:w-[18px] md:h-[18px] text-primary flex-shrink-0" />
                                <span>مصر، القاهرة</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-100 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-400 text-sm">
                        جميع الحقوق محفوظة © {new Date().getFullYear()} منصة الغزالي
                    </p>

                    {/* Developer Info */}
                    <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 px-4 py-2 rounded-full border border-gray-100">
                        <Code size={16} className="text-secondary" />
                        <span>تم التطوير بواسطة</span>
                        <span className="font-bold text-secondary">محمد طارق</span>
                        <span className="mx-1">|</span>
                        <span dir="ltr" className="font-mono text-xs">01284621015</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
