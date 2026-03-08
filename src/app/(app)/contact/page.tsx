'use client';

import { motion } from 'framer-motion';
import { Clock, Mail, MapPin, Phone, Send } from 'lucide-react';
import { toast } from 'sonner';

import { useState } from 'react';
import { sendContactEmail } from './actions';

export default function ContactPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData(e.currentTarget);
        const data = {
            name: formData.get('name') as string,
            email: formData.get('email') as string,
            subject: formData.get('subject') as string,
            message: formData.get('message') as string,
        };

        const result = await sendContactEmail(data);

        setIsSubmitting(false);

        if (result.success) {
            toast.success(`Благодариме ${data.name}! Вашата порака е испратена.`);
            (e.target as HTMLFormElement).reset();
        } else {
            toast.error(result.error || 'Се појави грешка. Ве молиме обидете се подоцна.');
        }
    };

    return (
        <main className="min-h-screen flex flex-col bg-background">
            {/* About Us & Contact Info */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

                        {/* Left Column: About Us & Info */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="mb-12">
                                <span className="text-sm font-semibold tracking-widest uppercase text-primary mb-2 block">Нашата приказна</span>
                                <h2 className="font-serif text-3xl text-foreground mb-6">Создадено со љубов за вашите најмали</h2>
                                <p className="text-muted-foreground leading-relaxed mb-6">
                                    Herb Garden започна како мал семеен сон – желба да им понудиме на нашите деца нешто повеќе од обични производи. Сакавме нежност, чистота и етика во секој бод.
                                </p>
                                <p className="text-muted-foreground leading-relaxed">
                                    Денес, ние сме заедница која верува во моќта на квалитетните материјали и безвременскиот дизајн. Секој производ во нашата продавница е внимателно изработен или одбран за да обезбеди најдобар почеток за вашето бебе.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                <div className="flex items-start gap-4">
                                    <div className="bg-primary/10 p-3 rounded-full text-primary">
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-foreground mb-1">Пишете ни</h4>
                                        <p className="text-sm text-muted-foreground">contact@herbgarden.mk</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="bg-primary/10 p-3 rounded-full text-primary">
                                        <Phone className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-foreground mb-1">Јавете ни се</h4>
                                        <p className="text-sm text-muted-foreground">072-233-754</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="bg-primary/10 p-3 rounded-full text-primary">
                                        <MapPin className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-foreground mb-1">Посетете нè</h4>
                                        <p className="text-sm text-muted-foreground">Бутик за деца Pepelashka</p>
                                        <p className="text-sm text-muted-foreground">Илинденска 24, Прилеп</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="bg-primary/10 p-3 rounded-full text-primary">
                                        <Clock className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-foreground mb-1">Работно време</h4>
                                        <p className="text-sm text-muted-foreground">Пон - Петок: 08:30 - 20:30</p>
                                        <p className="text-sm text-muted-foreground">Сабота: 09:00 - 16:00</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Right Column: Contact Form */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-border"
                        >
                            <h3 className="font-serif text-2xl text-foreground mb-8">Испратете ни порака</h3>
                            <form className="space-y-6" onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold uppercase tracking-wider text-primary">Вашето име</label>
                                        <input
                                            required
                                            name="name"
                                            type="text"
                                            className="w-full px-4 py-3 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all bg-background/50"
                                            placeholder="Име Презиме"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold uppercase tracking-wider text-primary">Е-маил адреса</label>
                                        <input
                                            required
                                            name="email"
                                            type="email"
                                            className="w-full px-4 py-3 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all bg-background/50"
                                            placeholder="example@mail.com"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold uppercase tracking-wider text-primary">Предмет</label>
                                    <input
                                        required
                                        name="subject"
                                        type="text"
                                        className="w-full px-4 py-3 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all bg-background/50"
                                        placeholder="Како можеме да помогнеме?"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold uppercase tracking-wider text-primary">Вашата порака</label>
                                    <textarea
                                        required
                                        name="message"
                                        rows={5}
                                        className="w-full px-4 py-3 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all bg-background/50 resize-none"
                                        placeholder="Напишете ја вашата порака тука..."
                                    ></textarea>
                                </div>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Send className="w-4 h-4" />
                                    {isSubmitting ? 'Се испраќа...' : 'Испрати порака'}
                                </button>
                            </form>
                        </motion.div>

                    </div>
                </div>
            </section>

            {/* Map Section */}
            <section className="py-20 bg-white/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="font-serif text-3xl text-foreground mb-4">Посетете нè</h2>
                        <p className="text-muted-foreground">Посетете го нашето продажно место во Прилеп.</p>
                    </div>
                    <div className="relative h-[500px] w-full rounded-3xl overflow-hidden shadow-inner border border-border">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2994.4845!2d21.5540!3d41.3464!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x135400!2sPrilep!5e0!3m2!1sen!2smk!4v1700000000000!5m2!1sen!2smk"
                            width="100%"
                            height="100%"
                            style={{ border: 0, filter: 'grayscale(0.3) contrast(1.1) brightness(0.95)' }}
                            allowFullScreen={true}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                        <div className="absolute bottom-8 left-8 bg-background/80 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-border max-w-xs hidden md:block">
                            <h4 className="font-serif text-lg text-foreground mb-2">Herb Garden</h4>
                            <p className="text-sm text-muted-foreground mb-4">Нашиот простор е дизајниран да биде топло катче за сите родители и нивните најмили.</p>
                            <a
                                href="https://www.google.com/maps/dir/?api=1&destination=Ilindenska+24,+Prilep"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary text-sm font-semibold hover:text-primary transition-colors flex items-center gap-2"
                            >
                                Добиј насоки <Send className="w-3 h-3" />
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
