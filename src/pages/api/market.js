// Sample data sebagai fallback jika API eksternal bermasalah
const sampleData = [
  {
    symbol: "Gold",
    last: 4037.75,
    high: 4041.23,
    low: 4001.8,
    open: 4020.8,
    prevClose: 4040.4,
    valueChange: -2.65,
    percentChange: -0.07
  },
  {
    symbol: "Silver",
    last: 49.109,
    high: 49.133,
    low: 48.498,
    open: 49.002,
    prevClose: 48.842,
    valueChange: 0.267,
    percentChange: 0.55
  },
  {
    symbol: "USD/IDR",
    last: 16528,
    high: 16574,
    low: 16496,
    open: 16574,
    prevClose: 16575,
    valueChange: -47,
    percentChange: -0.28
  }
];

export default async function handler(req, res) {
  try {
    // Coba ambil data dari API eksternal
    const response = await fetch(
      "https://endpoapi-production-3202.up.railway.app/api/quotes",
      {
        headers: {
          'Accept': 'application/json',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
          'Expires': '0'
        },
        // Timeout setelah 5 detik
        signal: AbortSignal.timeout(5000)
      }
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const responseData = await response.json();
    
    // Pastikan data ada dan dalam format yang diharapkan
    if (!responseData || !Array.isArray(responseData.data)) {
      console.error('Invalid API response format, using sample data');
      return res.status(200).json(sampleData);
    }
    
    // Ambil data dari response
    const data = responseData.data;
    
    // Proses data
    const validItems = data
      .filter(item => item && item.symbol)
      .map(item => ({
        symbol: String(item.symbol || '').replace('USD/IDR', 'IDR'), // Sesuaikan format symbol
        last: Number(item.last) || 0,
        high: Number(item.high) || 0,
        low: Number(item.low) || 0,
        open: Number(item.open) || 0,
        time: item.time || new Date().toISOString(),
        prevClose: Number(item.prevClose) || 0,
        valueChange: Number(item.valueChange) || 0,
        percentChange: Number(item.percentChange) || 0,
        Volume: Number(item.Volume) || 0,
        bid: Number(item.bid) || 0,
        ask: Number(item.ask) || 0
      }));
    
    // Pastikan ada data yang valid
    if (validItems.length > 0) {
      return res.status(200).json(validItems);
    } else {
      // Jika tidak ada data valid, kembalikan sample data
      return res.status(200).json(sampleData);
    }
  } catch (error) {
    console.error('Error in market API route:', error.message);
    // Kembalikan sample data jika terjadi error
    return res.status(200).json(sampleData);
  }
}
