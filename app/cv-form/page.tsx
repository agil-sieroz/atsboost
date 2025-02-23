"use client";

import { useState } from "react";
import { jsPDF } from "jspdf";
import { useRouter } from "next/navigation";

type Experience = {
  type: "kerja" | "magang" | "organisasi" | "pkl"; // Tambah tipe pengalaman
  company: string;
  position: string;
  description: string[];
  startYear: string;
  endYear: string;
  location: string;
};

type Education = {
  school: string;
  major: string;
  gpa: string;
  startYear: string;
  gradYear: string;
};

export default function CVForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    socialMedia: "",
    aboutMe: "",
    experiences: [{ type: "kerja" as const, company: "", position: "", description: ["", "", "", "", ""], startYear: "", endYear: "", location: "" } as Experience],
    education: { school: "", major: "", gpa: "", startYear: "", gradYear: "" } as Education,
    skills: ["", "", "", "", ""],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, index?: number, field?: string) => {
    const { name, value } = e.target;
    if (field === "experience" && index !== undefined) {
      const updatedExp = [...formData.experiences];
      if (name === "description") return;
      updatedExp[index][name as keyof Omit<Experience, "description">] = value;
      setFormData({ ...formData, experiences: updatedExp });
    } else if (field === "education") {
      setFormData({ ...formData, education: { ...formData.education, [name as keyof Education]: value } });
    } else if (field === "skills" && index !== undefined) {
      const updatedSkills = [...formData.skills];
      updatedSkills[index] = value;
      setFormData({ ...formData, skills: updatedSkills });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const addExperience = () => {
    setFormData({
      ...formData,
      experiences: [...formData.experiences, { type: "kerja" as const, company: "", position: "", description: ["", "", "", "", ""], startYear: "", endYear: "", location: "" } as Experience],
    });
  };

  const addSkill = () => {
    setFormData({ ...formData, skills: [...formData.skills, ""] });
  };

  const generatePDF = () => {
    const doc = new jsPDF({ format: "a4" });
    doc.setFont("helvetica");

    // Nama Lengkap
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text(formData.fullName, 20, 20);

    // Kontak
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`${formData.phone} | ${formData.email} | ${formData.address}`, 20, 30);

    // Tentang Saya
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Tentang Saya", 20, 45);
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    const isUniversity = formData.education.school.toLowerCase().includes("universitas");
    const majorLabel = isUniversity ? "prodi" : "jurusan";
    const firstExp = formData.experiences[0];
    const expTypeLabel = firstExp?.type === "kerja" ? "pekerja" : firstExp?.type === "magang" ? "magang" : firstExp?.type === "organisasi" ? "anggota organisasi" : "peserta PKL";
    const aboutMe = `Saya ${formData.fullName}, lulusan ${formData.education.school}, ${majorLabel} ${formData.education.major}. Saya memiliki pengalaman sebagai ${firstExp?.position || "profesional"} di ${firstExp?.company || "organisasi"} (${expTypeLabel}), dan saya memiliki keahlian sebagai ${formData.skills.filter(skill => skill).slice(0, 3).join(", ")}.`;
    doc.text(doc.splitTextToSize(aboutMe, 170), 20, 55);

    // Pengalaman
    let y = 80;
    const experienceTypes = ["kerja", "magang", "organisasi", "pkl"] as const;
    experienceTypes.forEach((type) => {
      const filteredExp = formData.experiences.filter(exp => exp.type === type);
      if (filteredExp.length > 0) {
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        const typeLabel = type === "kerja" ? "Pengalaman Kerja" : type === "magang" ? "Pengalaman Magang" : type === "organisasi" ? "Pengalaman Organisasi" : "Pengalaman PKL";
        doc.text(typeLabel, 20, y);
        filteredExp.forEach((exp) => {
          y += 10;
          doc.setFontSize(12);
          doc.setFont("helvetica", "bold");
          doc.text(`${exp.position} | ${exp.company}`, 20, y);
          y += 8;
          doc.setFont("helvetica", "normal");
          doc.text(exp.location, 20, y);
          doc.text(`${exp.startYear} - ${exp.endYear}`, 110, y);
          exp.description.filter(desc => desc).forEach((desc) => {
            y += 8;
            doc.setFontSize(12);
            doc.text("• " + desc, 25, y);
          });
          y += 5;
        });
        y += 5;
      }
    });

    // Pendidikan
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Pendidikan", 20, y);
    y += 10;
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    const gradeLabel = isUniversity ? "IPK" : "Nilai";
    doc.text(`${formData.education.school} | ${gradeLabel}: ${formData.education.gpa}`, 20, y);
    y += 8;
    doc.text(`${majorLabel.charAt(0).toUpperCase() + majorLabel.slice(1)} ${formData.education.major} | ${formData.education.startYear} - ${formData.education.gradYear}`, 20, y);

    // Keahlian
    y += 15;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Keahlian", 20, y);
    y += 10;
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    const filledSkills = formData.skills.filter(skill => skill);
    if (filledSkills.length <= 3) {
      filledSkills.forEach((skill) => {
        doc.text("• " + skill, 20, y);
        y += 8;
      });
    } else {
      const half = Math.ceil(filledSkills.length / 2);
      const leftSkills = filledSkills.slice(0, half);
      const rightSkills = filledSkills.slice(half);
      leftSkills.forEach((skill, i) => {
        doc.text("• " + skill, 20, y + i * 8);
        if (rightSkills[i]) {
          doc.text("• " + rightSkills[i], 100, y + i * 8);
        }
      });
      y += leftSkills.length * 8;
    }

    // Simpan dengan format CV NamaLengkap.pdf
    doc.save(`CV ${formData.fullName}.pdf`);
  };

  return (
    <div className="min-h-screen bg-black p-8 pt-20">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-cyan-400 mb-6 text-center md:text-4xl animate-glow">Buat CV Siap ATS Anda</h1>
        <form className="space-y-6 bg-gray-900 p-6 rounded-lg shadow-lg max-w-2xl mx-auto">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-cyan-400">Informasi Pribadi</h2>
            <input name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Nama Lengkap" className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white" required />
            <input name="phone" value={formData.phone} onChange={handleChange} placeholder="Nomor Telepon" className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white" required />
            <input name="email" value={formData.email} onChange={handleChange} placeholder="Email" className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white" required />
            <input name="address" value={formData.address} onChange={handleChange} placeholder="Alamat" className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white" required />
            <input name="socialMedia" value={formData.socialMedia} onChange={handleChange} placeholder="Media Sosial (Opsional)" className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white" />
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-cyan-400">Pengalaman</h2>
            {formData.experiences.map((exp, index) => (
              <div key={index} className="space-y-2 border border-gray-700 p-4 rounded bg-gray-800">
                <select
                  name="type"
                  value={exp.type}
                  onChange={(e) => handleChange(e, index, "experience")}
                  className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
                >
                  <option value="kerja">Pengalaman Kerja</option>
                  <option value="magang">Pengalaman Magang</option>
                  <option value="organisasi">Pengalaman Organisasi</option>
                  <option value="pkl">Pengalaman PKL</option>
                </select>
                <input name="position" value={exp.position} onChange={(e) => handleChange(e, index, "experience")} placeholder="Jabatan" className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white" required />
                <input name="company" value={exp.company} onChange={(e) => handleChange(e, index, "experience")} placeholder="Nama Perusahaan/Organisasi" className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white" required />
                {exp.description.map((desc, i) => (
                  <input
                    key={i}
                    value={desc}
                    onChange={(e) => {
                      const updatedExp = [...formData.experiences];
                      updatedExp[index].description[i] = e.target.value;
                      setFormData({ ...formData, experiences: updatedExp });
                    }}
                    placeholder={`Deskripsi Poin ${i + 1}`}
                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
                    required={i < 5}
                  />
                ))}
                <div className="flex space-x-2 flex-col sm:flex-row">
                  <input name="location" value={exp.location} onChange={(e) => handleChange(e, index, "experience")} placeholder="Lokasi" className="w-full sm:w-1/3 p-2 bg-gray-700 border border-gray-600 rounded text-white" required />
                  <input name="startYear" value={exp.startYear} onChange={(e) => handleChange(e, index, "experience")} placeholder="Tahun Masuk" className="w-full sm:w-1/3 p-2 bg-gray-700 border border-gray-600 rounded text-white" required />
                  <input name="endYear" value={exp.endYear} onChange={(e) => handleChange(e, index, "experience")} placeholder="Tahun Keluar" className="w-full sm:w-1/3 p-2 bg-gray-700 border border-gray-600 rounded text-white" required />
                </div>
              </div>
            ))}
            <button type="button" onClick={addExperience} className="bg-cyan-500 text-black px-4 py-2 rounded-full hover:bg-cyan-600 transition-colors">Tambah Pengalaman</button>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-cyan-400">Pendidikan</h2>
            <input name="school" value={formData.education.school} onChange={(e) => handleChange(e, 0, "education")} placeholder="Nama Sekolah/Universitas" className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white" required />
            <input name="major" value={formData.education.major} onChange={(e) => handleChange(e, 0, "education")} placeholder="Prodi/Jurusan" className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white" required />
            <input name="gpa" value={formData.education.gpa} onChange={(e) => handleChange(e, 0, "education")} placeholder="IPK/Nilai" className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white" required />
            <div className="flex space-x-2 flex-col sm:flex-row">
              <input name="startYear" value={formData.education.startYear} onChange={(e) => handleChange(e, 0, "education")} placeholder="Tahun Masuk" className="w-full sm:w-1/2 p-2 bg-gray-800 border border-gray-700 rounded text-white" required />
              <input name="gradYear" value={formData.education.gradYear} onChange={(e) => handleChange(e, 0, "education")} placeholder="Tahun Lulus" className="w-full sm:w-1/2 p-2 bg-gray-800 border border-gray-700 rounded text-white" required />
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-cyan-400">Keahlian</h2>
            {formData.skills.map((skill, index) => (
              <input
                key={index}
                value={skill}
                onChange={(e) => handleChange(e, index, "skills")}
                placeholder={`Keterampilan ${index + 1}`}
                className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
                required={index < 5}
              />
            ))}
            <button type="button" onClick={addSkill} className="bg-cyan-500 text-black px-4 py-2 rounded-full hover:bg-cyan-600 transition-colors">Tambah Keterampilan</button>
          </div>

          <div className="flex space-x-4 justify-between">
            <button type="button" onClick={() => router.push("/")} className="bg-gray-700 text-white px-4 py-2 rounded-full hover:bg-gray-600 transition-colors">
              Kembali
            </button>
            <button type="button" onClick={generatePDF} className="bg-cyan-500 text-black px-6 py-3 rounded-full hover:bg-cyan-600 transition-colors">
              Buat CV (PDF)
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}