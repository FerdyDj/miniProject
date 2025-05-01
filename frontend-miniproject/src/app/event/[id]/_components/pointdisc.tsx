import { IDiscount, IPoint } from "@/types/type";

interface IProps {
    points: IPoint | null;
    discount: IDiscount | null;
    usePoint: boolean;
    setUsePoint: React.Dispatch<React.SetStateAction<boolean>>;
    useVoucher: boolean;
    setUseVoucher: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function PointDiscount({points, discount, usePoint, useVoucher, setUsePoint, setUseVoucher}: IProps){
    return (
        <div>
            {(points || discount) && (
              <div className="px-6 py-3 space-y-4 bg-gray-800">
                {points && (
                  <div className="flex items-center justify-between">
                    <label className="text-gray-300">
                      Use Points (IDR {points.amount})
                    </label>
                    <input
                      type="checkbox"
                      checked={usePoint}
                      disabled={useVoucher}
                      onChange={(e) => {
                        setUsePoint(e.target.checked);
                        if (e.target.checked) setUseVoucher(false);
                      }}
                    />
                  </div>
                )}
                {discount && (
                  <div className="flex items-center justify-between">
                    <label className="text-gray-300">
                      Use Voucher ({discount.percen}%)
                    </label>
                    <input
                      type="checkbox"
                      checked={useVoucher}
                      disabled={usePoint}
                      onChange={(e) => {
                        setUseVoucher(e.target.checked);
                        if (e.target.checked) setUsePoint(false);
                      }}
                    />
                  </div>
                )}
              </div>
            )}
        </div>
    )
}