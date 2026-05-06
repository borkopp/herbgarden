'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import type { Dictionary } from '@/i18n/dictionaries/en';
import { 
    FileText, 
    ChevronDown, 
    CheckCircle2, 
    FlaskConical, 
    ShieldCheck, 
    Search, 
    Microscope, 
    Dna, 
    Droplets,
    Wind,
    Leaf,
    PackageCheck,
    ArrowRight
} from 'lucide-react';

type QualityDict = Dictionary['quality'];

const containerVariants: any = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const itemVariants: any = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
    },
};

export default function QualityClientPage({ dict }: { dict: QualityDict }) {
    const [openFaq, setOpenFaq] = useState<number | null>(0);

    return (
        <main className="min-h-screen flex flex-col bg-white overflow-hidden">
            {/* HERO SECTION */}
            <section className="relative pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center md:text-left"
                >
                    <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#8BA888] mb-6 block">
                        UNCOMPROMISING STANDARDS
                    </span>
                    <h1 className="font-display text-5xl md:text-7xl lg:text-8xl leading-[0.85] tracking-tighter text-black uppercase mb-8">
                        {dict.title.split('.').map((part, i) => {
                            const isStroked = i === 1; // Second word/line
                            if (!part.trim()) return null;
                            return (
                                <span key={i} className={`block ${isStroked ? 'text-transparent' : ''}`} style={isStroked ? { WebkitTextStroke: '2px #e5e5e5' } : {}}>
                                    {part.trim()}.
                                </span>
                            );
                        })}
                    </h1>
                    <p className="text-black/60 text-sm md:text-base leading-relaxed max-w-xl font-medium">
                        {dict.subtitle}
                    </p>
                </motion.div>
                
                {/* Decorative element */}
                <div className="absolute top-20 right-0 -z-10 opacity-5 hidden lg:block">
                    <FlaskConical size={400} strokeWidth={0.5} />
                </div>
            </section>

            {/* AT-A-GLANCE STATS */}
            <section className="py-12 bg-[#f6f6f6]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div 
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12"
                    >
                        {Object.values(dict.stats).map((stat, i) => (
                            <motion.div key={i} variants={itemVariants} className="flex flex-col items-center md:items-start">
                                <span className="text-5xl md:text-6xl font-display text-black mb-3">{stat.value}</span>
                                <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#8BA888] text-center md:text-left">
                                    {stat.label}
                                </span>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* WHAT WE TEST FOR - PANEL */}
            <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="lg:col-span-5"
                    >
                        <h2 className="text-3xl md:text-4xl font-display tracking-tighter uppercase text-black mb-6">
                            {dict.panel.title}
                        </h2>
                        <p className="text-black/60 text-sm leading-relaxed mb-8">
                            {dict.panel.subtitle}
                        </p>
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#8BA888]/10 text-[#8BA888] text-[10px] font-bold uppercase tracking-widest">
                            <Microscope size={14} />
                            ISO-ACCREDITED LABS
                        </div>
                    </motion.div>

                    <motion.div 
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4"
                    >
                        {[
                            { label: dict.panel.mitragynine, val: dict.panel.quantified, icon: Dna },
                            { label: dict.panel.hydroxy, val: dict.panel.quantified, icon: Droplets },
                            { label: dict.panel.total, val: dict.panel.quantified, icon: Search },
                            { label: dict.panel.lead, val: dict.panel.nd, icon: ShieldCheck },
                            { label: dict.panel.cadmium, val: dict.panel.nd, icon: FlaskConical },
                            { label: dict.panel.salmonella, val: dict.panel.notDetected, icon: Wind },
                        ].map((item, i) => (
                            <motion.div 
                                key={i} 
                                variants={itemVariants}
                                className="bg-white border border-black/5 p-6 rounded-2xl flex flex-col justify-between hover:border-[#8BA888]/30 transition-colors"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-2 rounded-lg bg-[#f6f6f6] text-black/40">
                                        <item.icon size={18} strokeWidth={1.5} />
                                    </div>
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#8BA888] px-2 py-1 bg-[#8BA888]/5 rounded">
                                        {item.val}
                                    </span>
                                </div>
                                <span className="text-xs font-bold uppercase tracking-tight text-black">{item.label}</span>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* OUR TESTING PROCESS */}
            <section className="py-24 bg-black text-white relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                        <div>
                            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#8BA888] mb-4 block">
                                TRACEABILITY
                            </span>
                            <h2 className="text-4xl md:text-6xl font-display tracking-tighter uppercase leading-none">
                                {dict.process.title}
                            </h2>
                        </div>
                        <p className="text-white/40 text-sm max-w-xs md:text-right">
                            {dict.process.subtitle}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
                        {[
                            { num: '01', ...dict.process.step1, icon: Leaf },
                            { num: '02', ...dict.process.step2, icon: Search },
                            { num: '03', ...dict.process.step3, icon: Microscope },
                            { num: '04', ...dict.process.step4, icon: FileText },
                            { num: '05', ...dict.process.step5, icon: PackageCheck },
                        ].map((step, i) => (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="relative group"
                            >
                                <div className="mb-6 text-[#8BA888] flex items-center gap-4">
                                    <span className="font-display text-2xl opacity-20">{step.num}</span>
                                    <div className="h-[1px] flex-grow bg-white/10 hidden md:block"></div>
                                </div>
                                <div className="mb-4 p-4 rounded-full bg-white/5 w-fit group-hover:bg-[#8BA888]/20 transition-colors">
                                    <step.icon size={24} strokeWidth={1.5} />
                                </div>
                                <h3 className="text-lg font-display uppercase tracking-tight mb-3">{step.title}</h3>
                                <p className="text-white/40 text-xs leading-relaxed font-medium">
                                    {step.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* COA LIBRARY */}
            <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-8 border-b border-black/5 pb-12">
                    <div className="max-w-xl">
                        <h2 className="text-4xl md:text-5xl font-display tracking-tighter uppercase text-black mb-4">
                            {dict.coa.title}
                        </h2>
                        <p className="text-black/60 text-sm leading-relaxed">
                            {dict.coa.subtitle}
                        </p>
                    </div>
                    <div className="w-full md:w-auto">
                        <p className="text-black/30 text-[10px] font-bold uppercase tracking-[0.2em] mb-2">{dict.coa.footer}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                        { title: dict.coa.crispApple, subtitle: dict.coa.crispAppleBatch, href: '#' },
                        { title: dict.coa.wildMelon, subtitle: dict.coa.wildMelonBatch, href: '#' },
                    ].map((doc, i) => (
                        <motion.a 
                            href={doc.href} 
                            key={i} 
                            whileHover={{ y: -5 }}
                            className="flex items-center justify-between p-8 rounded-[2rem] bg-[#f6f6f6] group transition-all hover:bg-[#8BA888] hover:text-white"
                        >
                            <div className="flex items-center gap-6">
                                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-black shadow-sm group-hover:bg-white/20 group-hover:text-white transition-colors">
                                    <FileText size={20} strokeWidth={1.5} />
                                </div>
                                <div>
                                    <h3 className="font-display text-lg md:text-xl uppercase tracking-tighter mb-1">{doc.title}</h3>
                                    <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest">{doc.subtitle}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest">
                                {dict.coa.button}
                                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            </div>
                        </motion.a>
                    ))}
                </div>
            </section>

            {/* PURITY GUARANTEE & FAQ */}
            <section className="py-24 bg-[#f6f6f6]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
                        {/* Guarantee */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#8BA888] mb-4 block">
                                QUALITY COMMITMENT
                            </span>
                            <h2 className="text-3xl md:text-4xl font-display tracking-tighter uppercase text-black mb-10">
                                {dict.guarantee.title}
                            </h2>
                            <div className="space-y-6">
                                {dict.guarantee.items.map((item, i) => (
                                    <div key={i} className="flex items-start gap-4">
                                        <div className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-[#8BA888] flex items-center justify-center text-white">
                                            <CheckCircle2 size={12} strokeWidth={3} />
                                        </div>
                                        <span className="text-black text-sm md:text-base font-medium">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* FAQ */}
                        <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-black/5">
                            <h3 className="text-2xl font-display uppercase tracking-tighter text-black mb-8">
                                {dict.faq.title}
                            </h3>
                            <div className="space-y-4">
                                {dict.faq.items.map((faq, i) => {
                                    const isOpen = openFaq === i;
                                    return (
                                        <div key={i} className="border-b border-black/5 last:border-0">
                                            <button
                                                onClick={() => setOpenFaq(isOpen ? null : i)}
                                                className="w-full text-left py-4 flex items-center justify-between group"
                                            >
                                                <span className={`text-sm font-bold uppercase tracking-tight transition-colors ${isOpen ? 'text-[#8BA888]' : 'text-black group-hover:text-[#8BA888]'}`}>
                                                    {faq.q}
                                                </span>
                                                <ChevronDown className={`w-4 h-4 text-black/20 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                                            </button>
                                            <AnimatePresence>
                                                {isOpen && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: 'auto', opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        transition={{ duration: 0.3 }}
                                                    >
                                                        <div className="pb-6 text-black/60 text-xs md:text-sm leading-relaxed font-medium">
                                                            {faq.a}
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
