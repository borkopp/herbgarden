'use client';

import { motion } from 'framer-motion';
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
            subject: 'Contact Form Submission',
            message: formData.get('message') as string,
        };

        const result = await sendContactEmail(data);

        setIsSubmitting(false);

        if (result.success) {
            toast.success(`Thank you ${data.name}! Your message has been sent.`);
            (e.target as HTMLFormElement).reset();
        } else {
            toast.error(result.error || 'An error occurred. Please try again later.');
        }
    };

    return (
        <main className="min-h-screen flex flex-col bg-white">
            {/* Top Section */}
            <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-black/40 mb-6 block">SENSORY ENHANCEMENT LABORATORY</span>
                    <h1 className="font-display text-5xl md:text-7xl lg:text-[7rem] leading-[0.85] tracking-tighter text-black uppercase">
                        BOTANICAL<br/>
                        <span className="text-transparent" style={{ WebkitTextStroke: '2px #e5e5e5' }}>ESSENCE</span>
                    </h1>
                    <p className="mt-8 text-black/60 text-xs md:text-sm leading-relaxed max-w-lg font-medium">
                        Herb Garden is a boutique sensory lab dedicated to the extraction of nature's most vibrant profiles. Engineered for the discerning palate and designed for the ritual of flavor.
                    </p>
                </motion.div>
            </section>

            {/* Middle Section (Philosophy & Badge) */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center border-t border-black/5 pt-16">
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-10"
                    >
                        <div>
                            <h2 className="font-display text-xl md:text-2xl uppercase tracking-tighter text-black mb-4">Our Philosophy</h2>
                            <p className="text-black/60 text-xs md:text-sm leading-relaxed font-medium">
                                We believe in depth over breadth. Our highly concentrated botanical essences are derived from organic sources, designed for precision flavoring with zero synthetic additives.
                            </p>
                        </div>
                        <div>
                            <h2 className="font-display text-xl md:text-2xl uppercase tracking-tighter text-black mb-4">Clinical Grade Purity</h2>
                            <p className="text-black/60 text-xs md:text-sm leading-relaxed font-medium">
                                Every vial captures the soul of summer, extracted using cold-pressed processes to ensure sustainably sourced, high bioavailability profiles of nature's finest fruits.
                            </p>
                        </div>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="lg:col-span-4 flex justify-center lg:justify-end"
                    >
                        <div className="w-48 h-48 rounded-full bg-black flex items-center justify-center p-6 text-center text-white shadow-xl shadow-black/10">
                            <span className="text-[9px] font-bold tracking-[0.2em] uppercase leading-[2.5]">
                                PURE <br/>•<br/> BOTANICAL <br/>•<br/> ESSENCE
                            </span>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Bottom Section (Contact & Form) */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full mb-20 border-t border-black/5">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
                    {/* Left Info */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="lg:col-span-5 space-y-12 pt-8"
                    >
                        <div>
                            <h2 className="text-3xl md:text-4xl font-display tracking-tighter uppercase text-black mb-4">Get in touch</h2>
                            <p className="text-black/60 text-xs md:text-sm leading-relaxed font-medium max-w-sm">
                                For inquiries about our extracts, wholesale partnerships, or general questions, please contact our laboratory team.
                            </p>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-black/40 block mb-1">Email</span>
                                <a href="mailto:contact@herbgarden.mk" className="font-bold text-black text-xs md:text-sm hover:text-black/60 transition-colors">contact@herbgarden.mk</a>
                            </div>
                            <div>
                                <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-black/40 block mb-1">Phone</span>
                                <a href="tel:072233754" className="font-bold text-black text-xs md:text-sm hover:text-black/60 transition-colors">072-233-754</a>
                            </div>
                            <div>
                                <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-black/40 block mb-1">Location</span>
                                <p className="font-bold text-black text-xs md:text-sm leading-relaxed">Ilindenska 24<br/>Prilep 7500</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Form */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="lg:col-span-7 bg-[#f6f6f6] rounded-[2rem] p-8 md:p-10 lg:p-12"
                    >
                        <h3 className="text-lg font-display uppercase tracking-widest text-black mb-10">Send a message</h3>
                        <form className="space-y-8" onSubmit={handleSubmit}>
                            <div className="relative">
                                <input 
                                    required
                                    name="name"
                                    type="text"
                                    placeholder="FULL NAME"
                                    className="w-full bg-transparent border-b border-black/10 pb-4 text-[10px] md:text-xs font-bold text-black placeholder:text-black/30 placeholder:uppercase placeholder:tracking-widest focus:outline-none focus:border-black transition-colors"
                                />
                            </div>
                            <div className="relative">
                                <input 
                                    required
                                    name="email"
                                    type="email"
                                    placeholder="EMAIL ADDRESS"
                                    className="w-full bg-transparent border-b border-black/10 pb-4 text-[10px] md:text-xs font-bold text-black placeholder:text-black/30 placeholder:uppercase placeholder:tracking-widest focus:outline-none focus:border-black transition-colors"
                                />
                            </div>
                            <div className="relative">
                                <textarea 
                                    required
                                    name="message"
                                    rows={2}
                                    placeholder="MESSAGE"
                                    className="w-full bg-transparent border-b border-black/10 pb-4 text-[10px] md:text-xs font-bold text-black placeholder:text-black/30 placeholder:uppercase placeholder:tracking-widest focus:outline-none focus:border-black transition-colors resize-none overflow-hidden min-h-[40px]"
                                />
                            </div>
                            <div className="pt-2">
                                <button 
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="bg-black text-white px-8 py-3 rounded-full text-[9px] md:text-[10px] font-bold uppercase tracking-widest hover:bg-black/80 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:hover:scale-100 disabled:hover:bg-black w-fit"
                                >
                                    {isSubmitting ? 'SENDING...' : 'SEND'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            </section>
        </main>
    );
}
