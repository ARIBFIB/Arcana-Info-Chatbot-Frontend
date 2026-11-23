type HolidayRow = {
  date: string;
  day: string;
  occasion: string;
  type: string;
  lunar?: boolean;
};

const HOLIDAYS_2026: HolidayRow[] = [
  {
    date: "01 Jan",
    day: "Thursday",
    occasion: "New Year's Day",
    type: "Public Holiday",
  },
  {
    date: "05 Feb",
    day: "Thursday",
    occasion: "Kashmir Solidarity Day",
    type: "Public Holiday",
  },
  { date: "23 Mar", day: "Monday", occasion: "Pakistan Day", type: "Public Holiday" },
  { date: "01 May", day: "Friday", occasion: "Labour Day", type: "Public Holiday" },
  {
    date: "27 May",
    day: "Wednesday",
    occasion: "Eid-ul-Azha",
    type: "Eid-ul-Azha *",
    lunar: true,
  },
  {
    date: "28 May",
    day: "Thursday",
    occasion: "Youm-e-Takbeer",
    type: "Public Holiday",
  },
  {
    date: "28 May",
    day: "Thursday",
    occasion: "Eid-ul-Azha (Day 2)",
    type: "Eid-ul-Azha (Day 2) *",
    lunar: true,
  },
  {
    date: "29 May",
    day: "Friday",
    occasion: "Eid-ul-Azha (Day 3)",
    type: "Eid-ul-Azha (Day 3) *",
    lunar: true,
  },
  {
    date: "24 Jun",
    day: "Wednesday",
    occasion: "Ashura (9 Muharram)",
    type: "Ashura (9 Muharram) *",
    lunar: true,
  },
  {
    date: "25 Jun",
    day: "Thursday",
    occasion: "Ashura (10 Muharram)",
    type: "Ashura (10 Muharram) *",
    lunar: true,
  },
  {
    date: "14 Aug",
    day: "Friday",
    occasion: "Independence Day",
    type: "Public Holiday",
  },
  { date: "11 Nov", day: "Wednesday", occasion: "Iqbal Day", type: "Public Holiday" },
  {
    date: "25 Dec",
    day: "Friday",
    occasion: "Quaid-e-Azam Day / Christmas",
    type: "Public Holiday",
  },
];

export function ChatHolidayTable() {
  return (
    <div className="mt-4 w-full overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-white/12">
            {["Date", "Day", "Occasion", "Type"].map((col) => (
              <th key={col} scope="col" className="pb-2 pr-3 text-left">
                <span className="font-body text-sm leading-normal font-bold text-off-white">
                  {col}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {HOLIDAYS_2026.map((row) => (
            <tr
              key={`${row.date}-${row.occasion}`}
              className="border-b border-white/[0.06] last:border-none"
            >
              <td className="py-1.5 pr-3">
                <span className="font-body text-sm leading-normal font-normal text-off-white/85">
                  {row.date}
                </span>
              </td>
              <td className="py-1.5 pr-3">
                <span className="font-body text-sm leading-normal font-normal text-off-white/85">
                  {row.day}
                </span>
              </td>
              <td className="py-1.5 pr-3">
                <span className="font-body text-sm leading-normal font-normal text-off-white/85">
                  {row.occasion}
                </span>
              </td>
              <td className="py-1.5">
                <span
                  className={`font-body text-sm leading-normal font-normal ${row.lunar ? "text-white/65" : "text-white/85"}`}
                >
                  {row.type}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
