export const RECOMMENDED_DESTINATIONS = [
  { id: 1, name: '근처 체험 찾기', desc: '가까운 곳에서 즐길 수 있는 체험을 찾아보세요.' },
  { id: 2, name: '광안리해수욕장', desc: '해변으로 인기 있는 곳' },
  { id: 3, name: '오사카시, 일본', desc: '관광 명소: 오사카성' },
  { id: 4, name: '부산, 부산', desc: '화려한 나이트라이프로 유명한 곳' },
  { id: 5, name: '제주', desc: '자연을 만끽하기 좋은 곳' },
  { id: 6, name: '속초시, 강원도', desc: '호수로 인기 있는 곳' },
  { id: 7, name: '강릉시, 강원도', desc: '해변의 매력을 느낄 수 있는 곳' },
]

const ALL_DESTINATIONS = [
  { id: 101, name: '여수시', subtext: '대한민국 · 전라남도 · 도시' },
  { id: 102, name: '이순신광장', subtext: '대한민국 · 전라남도 · 여수시 · 공원' },
  { id: 103, name: '여수 베네치아호텔 앤 스위트', subtext: '대한민국 · 전라남도 · 여수시 · 숙박시설' },
  { id: 104, name: '여수시청', subtext: '대한민국 · 전라남도 · 여수시' },
  { id: 105, name: '운천동', subtext: '대한민국 · 전라남도 · 지역' },
  { id: 106, name: '광안리해수욕장', subtext: '대한민국 · 부산광역시 · 수영구 · 해수욕장' },
  { id: 107, name: '오사카시', subtext: '일본 · 오사카부 · 도시' },
  { id: 108, name: '오사카성', subtext: '일본 · 오사카부 · 오사카시 · 관광명소' },
  { id: 109, name: '부산', subtext: '대한민국 · 부산광역시 · 도시' },
  { id: 110, name: '제주시', subtext: '대한민국 · 제주특별자치도 · 도시' },
  { id: 111, name: '속초시', subtext: '대한민국 · 강원도 · 도시' },
  { id: 112, name: '강릉시', subtext: '대한민국 · 강원도 · 도시' },
]

export function searchDestinations(query) {
  if (!query.trim()) return []
  const q = query.trim().toLowerCase()
  return ALL_DESTINATIONS
    .filter(d => d.name.toLowerCase().includes(q) || d.subtext.toLowerCase().includes(q))
    .slice(0, 8)
}
