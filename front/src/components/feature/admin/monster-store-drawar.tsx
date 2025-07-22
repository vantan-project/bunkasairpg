import { ImageIcon } from "@/components/shared/icons/image-icon";
import { MantineDrawer } from "@/components/shared/mantine/mantine-drawer";
import { MantineDropzone } from "@/components/shared/mantine/mantine-dropzone";
import { MantineImage } from "@/components/shared/mantine/mantine-image";
import { MantineSlider } from "@/components/shared/mantine/mantine-slider";
import { MantineTextInput } from "@/components/shared/mantine/mantine-text-input";
import { useForm } from "@mantine/form";
import { AdminButton } from "./admin-button";
import { useRouter } from "next/navigation";
import { useAdminContext } from "@/hooks/use-admin-context";
import { showNotification } from "@mantine/notifications";
import { showToast } from "@/utils/show-toast";

type Form = {
  name: string;
  imageFile: File | null;
  attack: number;
  hitPoint: number;
  experiencePoint: number;

  slash: number;
  blow: number;
  shoot: number;
  neutral: number;
  flame: number;
  water: number;
  wood: number;
  shine: number;
  dack: number;

  weapon: {
    id: number;
    name: string;
  } | null;
  item: {
    id: number;
    name: string;
  } | null;
};

type Props = {
  opened: boolean;
  close: () => void;
  weapon: {
    id: number;
    name: string;
  } | null;
  item: {
    id: number;
    name: string;
  } | null;
};

export function MonsterStoreDrawer({ opened, close, weapon, item }: Props) {
  const router = useRouter();
  const { setIsSelected, monsterWeapon, monsterItem } = useAdminContext();

  const form = useForm<Form>({
    initialValues: {
      name: "",
      imageFile: null,
      attack: 0,
      hitPoint: 0,
      experiencePoint: 0,
      slash: 0.0,
      blow: 0.0,
      shoot: 0.0,
      neutral: 0.0,
      flame: 0.0,
      water: 0.0,
      wood: 0.0,
      shine: 0.0,
      dack: 0.0,
      weapon,
      item,
    },
  });

  const sliderMarks = [
    { value: -1.0, label: "弱点\n200%" },
    { value: -0.9, label: null },
    { value: -0.8, label: null },
    { value: -0.7, label: null },
    { value: -0.6, label: null },
    { value: -0.5, label: "弱点\n150%" },
    { value: -0.4, label: null },
    { value: -0.3, label: null },
    { value: -0.2, label: null },
    { value: -0.1, label: null },
    { value: 0.0, label: "通常\n100%" },
    { value: 0.1, label: null },
    { value: 0.2, label: null },
    { value: 0.3, label: null },
    { value: 0.4, label: null },
    { value: 0.5, label: "耐性\n50%" },
    { value: 0.6, label: null },
    { value: 0.7, label: null },
    { value: 0.8, label: null },
    { value: 0.9, label: null },
    { value: 1.0, label: "無効\n0%" },
    { value: 1.1, label: null },
    { value: 1.2, label: null },
    { value: 1.3, label: null },
    { value: 1.4, label: null },
    { value: 1.5, label: "吸収\n50%" },
    { value: 1.6, label: null },
    { value: 1.7, label: null },
    { value: 1.8, label: null },
    { value: 1.9, label: null },
    { value: 2.0, label: "吸収\n100%" },
  ];

  const resistanceFields = [
    { label: "斬撃耐性", color: "gray", value: "slash" },
    { label: "打撃耐性", color: "gray", value: "blow" },
    { label: "射撃耐性", color: "gray", value: "shoot" },
    { label: "無属性耐性", color: "silver", value: "neutral" },
    { label: "炎属性耐性", color: "red", value: "flame" },
    { label: "水属性耐性", color: "blue", value: "water" },
    { label: "木属性耐性", color: "green", value: "wood" },
    { label: "光属性耐性", color: "yellow", value: "shine" },
    { label: "闇属性耐性", color: "violet", value: "dack" },
  ];

  return (
    <MantineDrawer
      opened={opened}
      onClose={close}
      title="モンスター追加"
      position="bottom"
      size="lg"
      radius="lg"
      classNames={{
        title: "!font-bold text-black",
      }}
    >
      <form className="p-4 flex flex-col gap-12">
        <div className="grid grid-cols-[300px_auto] gap-4">
          <div>
            画像
            <MantineDropzone
              onDrop={(f) => form.setFieldValue("imageFile", f[0])}
              classNames={{
                root: "aspect-square !p-0",
                inner: "h-full",
              }}
            >
              {form.values.imageFile === null ? (
                <div className="h-full flex justify-center items-center">
                  <ImageIcon className="w-12 h-12 text-black" />
                </div>
              ) : (
                <MantineImage
                  src={URL.createObjectURL(form.values.imageFile)}
                />
              )}
            </MantineDropzone>
          </div>

          <div className="px-1 flex flex-col gap-4 overflow-y-auto max-h-[400px] [scrollbar-color:var(--color-black)_transparent]">
            <div className="grid grid-cols-2 gap-4">
              <MantineTextInput label="名前" {...form.getInputProps("name")} />
              <MantineTextInput
                label="攻撃力"
                type="number"
                {...form.getInputProps("attack")}
              />
              <MantineTextInput
                label="HP"
                type="number"
                {...form.getInputProps("hitPoint")}
              />
              <MantineTextInput
                label="獲得経験値"
                type="number"
                {...form.getInputProps("experiencePoint")}
              />
              <MantineTextInput
                label="ドロップ武器"
                value={monsterWeapon?.name || ""}
                onClick={() => {
                  setIsSelected(true);
                  router.push("/admin/weapon");
                  close();
                  showToast(true, ["武器を選択してください"]);
                }}
                readOnly
              />

              <MantineTextInput
                label="ドロップ武器"
                value={monsterItem?.name || ""}
                onClick={() => {
                  setIsSelected(true);
                  router.push("/admin/item");
                  close();
                  showToast(true, ["アイテムを選択してください"]);
                }}
                readOnly
              />
            </div>

            <div className="flex flex-col gap-12 px-8">
              {resistanceFields.map((field) => (
                <div key={field.label}>
                  {field.label}
                  <MantineSlider
                    label={(v) =>
                      sliderMarks.find(({ value }) => value === v)?.label
                    }
                    color={field.color}
                    min={-1.0}
                    max={2.0}
                    step={0.1}
                    marks={sliderMarks}
                    classNames={{
                      markLabel: "!whitespace-pre-line",
                    }}
                    {...form.getInputProps(field.value)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <AdminButton type="submit">追加</AdminButton>
      </form>
    </MantineDrawer>
  );
}
