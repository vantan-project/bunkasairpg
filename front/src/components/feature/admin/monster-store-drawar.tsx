import { useForm } from "react-hook-form";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  Button,
  Form,
  Input,
  Image,
  NumberInput,
  Slider,
  SliderProps,
  addToast,
} from "@heroui/react";
import { PhysicsType } from "@/types/physics-type";
import { ElementType } from "@/types/element-type";
import { ImageIcon } from "@/components/shared/icons/image-icon";
import { useAdminContext } from "@/hooks/use-admin-context";
import { useRouter } from "next/navigation";
import { MonsterStoreRequest, monsterStore } from "@/api/monster-store";
import { useEffect } from "react";
import { addToasts } from "@/utils/add-toasts";

type Props = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  weapon: {
    id: number;
    name: string;
  } | null;
  item: {
    id: number;
    name: string;
  } | null;
};

export function MonsterStoreDrawer({
  isOpen,
  onOpenChange,
  weapon,
  item,
}: Props) {
  const router = useRouter();
  const { setIsSelected, setMonsterWeapon, setMonsterItem } = useAdminContext();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
  } = useForm<MonsterStoreRequest>();

  const onSubmit = (data:MonsterStoreRequest) => {
    monsterStore(data).then(({ success, messages }) => {
      addToasts(success, messages);
      if (success) {
        window.location.href = "/admin/monster";
      }
    })
  }

  useEffect(() => setValue("weaponId", weapon?.id ?? null), [weapon]);
  useEffect(() => setValue("itemId", item?.id ?? null), [item]);

  const sliderMarks = [
    { value: -1.0, label: "弱点\n200%" },
    { value: -0.9, label: "" },
    { value: -0.8, label: "" },
    { value: -0.7, label: "" },
    { value: -0.6, label: "" },
    { value: -0.5, label: "弱点\n150%" },
    { value: -0.4, label: "" },
    { value: -0.3, label: "" },
    { value: -0.2, label: "" },
    { value: -0.1, label: "" },
    { value: 0.0, label: "通常\n100%" },
    { value: 0.1, label: "" },
    { value: 0.2, label: "" },
    { value: 0.3, label: "" },
    { value: 0.4, label: "" },
    { value: 0.5, label: "耐性\n50%" },
    { value: 0.6, label: "" },
    { value: 0.7, label: "" },
    { value: 0.8, label: "" },
    { value: 0.9, label: "" },
    { value: 1.0, label: "無効\n0%" },
    { value: 1.1, label: "" },
    { value: 1.2, label: "" },
    { value: 1.3, label: "" },
    { value: 1.4, label: "" },
    { value: 1.5, label: "吸収\n50%" },
    { value: 1.6, label: "" },
    { value: 1.7, label: "" },
    { value: 1.8, label: "" },
    { value: 1.9, label: "" },
    { value: 2.0, label: "吸収\n100%" },
  ];

  const resistanceFields: {
    label: string;
    color: SliderProps["color"];
    value: PhysicsType | ElementType;
  }[] = [
    { label: "斬撃耐性", color: "foreground", value: "slash" },
    { label: "打撃耐性", color: "foreground", value: "blow" },
    { label: "射撃耐性", color: "foreground", value: "shoot" },
    { label: "無属性耐性", color: "foreground", value: "neutral" },
    { label: "炎属性耐性", color: "danger", value: "flame" },
    { label: "水属性耐性", color: "primary", value: "water" },
    { label: "木属性耐性", color: "success", value: "wood" },
    { label: "光属性耐性", color: "warning", value: "shine" },
    { label: "闇属性耐性", color: "secondary", value: "dark" },
  ];

  const imageFile = watch("imageFile");
  return (
    <Drawer
      size="xl"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      placement="bottom"
      classNames={{ closeButton: "text-2xl" }}
    >
      <DrawerContent className="pb-4">
        <DrawerHeader>モンスター追加</DrawerHeader>
        <DrawerBody className="[scrollbar-color:var(--color-black)_transparent]">
          <Form className="flex flex-col gap-12" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid lg:grid-cols-[300px_1fr] gap-4 w-full">
              <div>
                <input
                  className="hidden"
                  type="file"
                  id="file"
                  {...register("imageFile", {
                    onChange: (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setValue("imageFile", file);
                      }
                    },
                  })}
                />
                <label
                  className="block aspect-square rounded-2xl bg-gray hover:bg-gray-dark overflow-hidden"
                  htmlFor="file"
                >
                  {imageFile instanceof File ? (
                    <div className="w-full h-full aspect-square bg-gray flex items-center justify-center">
                      <Image
                        className="object-cover w-full h-auto"
                        src={URL.createObjectURL(imageFile)}
                        radius="none"
                        removeWrapper
                      />
                    </div>
                  ) : (
                    <div className="h-full flex justify-center items-center">
                      <ImageIcon className="w-12 h-12 text-black" />
                    </div>
                  )}
                </label>
              </div>

              <div className="flex flex-col gap-4 lg:overflow-y-auto lg:h-[380px] [scrollbar-color:var(--color-black)_transparent]">
                <div className="grid grid-cols-2 gap-4 h-fit">
                  <Input label="名前" {...register("name")} />
                  <NumberInput
                    label="攻撃力"
                    {...register("attack")}
                    onChange={(v) =>
                      typeof v === "number" && setValue("attack", v)
                    }
                  />
                  <NumberInput
                    label="HP"
                    {...register("hitPoint")}
                    onChange={(v) =>
                      typeof v === "number" && setValue("hitPoint", v)
                    }
                  />
                  <NumberInput
                    label="獲得経験値"
                    {...register("experiencePoint")}
                    onChange={(v) =>
                      typeof v === "number" && setValue("experiencePoint", v)
                    }
                  />
                  <div className="relative">
                    <Input
                      label="ドロップ武器"
                      {...register("weaponId")}
                      value={weapon?.name || ""}
                      isClearable
                      onClear={() => setMonsterWeapon(null)}
                      classNames={{
                        clearButton: "z-20",
                      }}
                    />
                    <div
                      className="absolute top-0 w-full h-full z-10"
                      onClick={() => {
                        setIsSelected(true);
                        addToast({
                          title: "武器を選択してください",
                        });
                        router.push("/admin/weapon");
                        onOpenChange(false);
                      }}
                    />
                  </div>
                  <div className="relative">
                    <Input
                      label="ドロップアイテム"
                      {...register("itemId")}
                      value={item?.name || ""}
                      isClearable
                      onClear={() => setMonsterItem(null)}
                      classNames={{
                        clearButton: "z-20",
                      }}
                    />
                    <div
                      className="absolute top-0 w-full h-full z-10"
                      onClick={() => {
                        setIsSelected(true);
                        addToast({
                          title: "アイテムを選択してください",
                        });
                        router.push("/admin/item");
                        onOpenChange(false);
                      }}
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-12 px-2">
                  {resistanceFields.map((field) => (
                    <div key={field.label}>
                      <Slider
                        label={field.label}
                        color={field.color}
                        formatOptions={{ style: "percent" }}
                        maxValue={2.0}
                        minValue={-1.0}
                        showSteps={true}
                        step={0.1}
                        marks={sliderMarks}
                        classNames={{
                          mark: "!whitespace-pre-line",
                        }}
                        {...register(field.value)}
                        onChange={(v) =>
                          typeof v === "number" && setValue(field.value, v)
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <Button className="bg-black text-white" fullWidth type="submit">
              追加
            </Button>
          </Form>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}
