export async function fetchTanggalMasehi(hijriMonth, hijriYear) {
    const response = await fetch(`https://api.aladhan.com/v1/hToGCalendar/${hijriMonth}/${hijriYear}`, {
        method: "GET"
    })

    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data.data;
}

export async function fetchJadwalSholat(cityId, year, month) {
    const response = await fetch(`https://api.myquran.com/v2/sholat/jadwal/${cityId}/${year}/${month}`, {
        method: "GET"
    });
    const data = await response.json();
    if (data.status !== true) {
        throw new Error("Failed to fetch prayer schedule");
    }
    return data.data.jadwal;
}

export async function fetchHijriToday() {
    const response = await fetch(`https://api.myquran.com/v2/cal/hijr/?adj=-1`, {
        method: "GET"
    });
    const data = await response.json();
    if (data.status !== true) {
        throw new Error("Failed to fetch Hijri date");
    }
    return data.data;
}