import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { Translated } from "../../../traducoes/I18nContext";
import { useI18n } from "../../../traducoes/useI18n";

export function PassportQrCode({ value, lotId }) {
  const { t } = useI18n();
  const [dataUrl, setDataUrl] = useState("");
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let active = true;
    setDataUrl("");
    setFailed(false);

    QRCode.toDataURL(value, {
      errorCorrectionLevel: "H",
      margin: 2,
      width: 360,
      color: {
        dark: "#07140fff",
        light: "#ffffffff",
      },
    })
      .then((result) => active && setDataUrl(result))
      .catch(() => active && setFailed(true));

    return () => {
      active = false;
    };
  }, [value]);

  return (
    <Translated>
      <div className="passport-qr-shell">
        <div className="passport-qr-code">
          {dataUrl ? (
            <img
              src={dataUrl}
              alt={`${t("QR Code verificável do lote")} ${lotId}`}
            />
          ) : (
            <div className="passport-qr-loading" role="status">
              {failed ? "QR Code indisponível" : "Gerando QR Code..."}
            </div>
          )}
          {dataUrl && (
            <span className="passport-qr-mark" aria-hidden="true">
              FS
            </span>
          )}
        </div>
        <div className="passport-qr-caption">
          <strong>Verificação instantânea</strong>
          <span>Escaneie para abrir este registro digital.</span>
        </div>
      </div>
    </Translated>
  );
}
