import Image from "next/image";
import styles from "./DeviceMockup.module.css";

type Capture = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

type DeviceMockupProps = {
  desktop: Capture;
  mobile?: Capture;
  siteHost?: string;
  captions: { desktop: string; mobile?: string };
};

export function DeviceMockup({ desktop, mobile, siteHost, captions }: DeviceMockupProps) {
  return (
    <div className={styles.devices}>
      <figure className={styles.desktop}>
        <div className={styles.frame}>
          <div className="browser-bar dark" aria-hidden="true">
            <i />
            <i />
            <i />
            {siteHost && <span>{siteHost}</span>}
          </div>
          <Image
            {...desktop}
            alt={desktop.alt}
            loading="eager"
            fetchPriority="high"
            sizes={mobile ? "(max-width: 640px) 92vw, (max-width: 1560px) 67vw, 1040px" : "(max-width: 1560px) 92vw, 1440px"}
          />
        </div>
        <figcaption>{captions.desktop}</figcaption>
      </figure>

      {mobile && (
        <figure className={styles.mobile}>
          <div className={styles.phone}>
            <Image {...mobile} alt={mobile.alt} loading="lazy" sizes="(max-width: 640px) 208px, (max-width: 1560px) 23vw, 256px" />
          </div>
          {captions.mobile && <figcaption>{captions.mobile}</figcaption>}
        </figure>
      )}
    </div>
  );
}
