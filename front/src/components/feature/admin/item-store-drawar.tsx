import { useForm } from "react-hook-form";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  Button,
  Form,
  Input,
  Select,
  SelectItem,
  Image,
  NumberInput,
  Slider,
} from "@heroui/react";
import { PhysicsType } from "@/types/physics-type";
import { ElementType } from "@/types/element-type";
import { EffectType } from "@/types/effect-type";
import { ImageIcon } from "@/components/shared/icons/image-icon";
import { CloseIcon } from "@/components/shared/icons/close-icon";

type FormValues = {
  name: string;
  imageFile: File | null;
  effectType: EffectType;
  heal: {
    amount: number;
  };
  buff: {
    rate: number;
    target: PhysicsType | ElementType;
  };
  debuff: {
    rate: number;
    target: PhysicsType | ElementType;
  };
};

type Props = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
};

export function ItemStoreDrawer({ isOpen, onOpenChange }: Props) {
  const sliderMarks = [
    { value: 0.0, label: "0%" },
    { value: 0.1, label: "10%" },
    { value: 0.2, label: "20%" },
    { value: 0.3, label: "30%" },
    { value: 0.4, label: "40%" },
    { value: 0.5, label: "50%" },
    { value: 0.6, label: "60%" },
    { value: 0.7, label: "70%" },
    { value: 0.8, label: "80%" },
    { value: 0.9, label: "90%" },
    { value: 1.0, label: "100%" },
  ];

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<FormValues>();

  const imageFile = watch("imageFile");
  const effectType = watch("effectType");
  return (
    <Drawer
      size="2xl"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      placement="bottom"
      classNames={{ closeButton: "text-2xl" }}
    >
      <DrawerContent className="pb-4">
        <DrawerHeader>アイテム追加</DrawerHeader>
        <DrawerBody className="[scrollbar-color:var(--color-black)_transparent]">
          <Form className="flex flex-col gap-12">
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

              <div className="flex flex-col gap-4">
                <Input label="名前" {...register("name")} />
                <Select label="カテゴリー" {...register("effectType")}>
                  <SelectItem key="heal">ヒール</SelectItem>
                  <SelectItem key="buff">バフ</SelectItem>
                  <SelectItem key="debuff">デバフ</SelectItem>
                </Select>

                {effectType === "heal" && (
                  <NumberInput
                    label="回復量"
                    {...register("heal.amount")}
                    onChange={(v) =>
                      typeof v === "number" && setValue("heal.amount", v)
                    }
                  />
                )}

                {effectType === "buff" && (
                  <>
                    <Select label="バフ対象" {...register("buff.target")}>
                      <SelectItem key="slash">斬撃威力</SelectItem>
                      <SelectItem key="blow">打撃威力</SelectItem>
                      <SelectItem key="shoot">射撃威力</SelectItem>
                      <SelectItem key="neutral">無属性威力</SelectItem>
                      <SelectItem key="flame">炎属性威力</SelectItem>
                      <SelectItem key="water">水属性威力</SelectItem>
                      <SelectItem key="wood">木属性威力</SelectItem>
                      <SelectItem key="shine">光属性威力</SelectItem>
                      <SelectItem key="dark">闇属性威力</SelectItem>
                    </Select>
                    <Slider
                      formatOptions={{ style: "percent" }}
                      label="バフ量"
                      maxValue={1.0}
                      minValue={0.0}
                      showSteps={true}
                      step={0.1}
                      marks={sliderMarks}
                      {...register("buff.rate")}
                      onChange={(v) =>
                        typeof v === "number" && setValue("buff.rate", v)
                      }
                      color="foreground"
                    />
                  </>
                )}

                {effectType === "debuff" && (
                  <>
                    <Select label="デバフ対象" {...register("debuff.target")}>
                      <SelectItem key="slash">斬撃耐性</SelectItem>
                      <SelectItem key="blow">打撃耐性</SelectItem>
                      <SelectItem key="shoot">射撃耐性</SelectItem>
                      <SelectItem key="neutral">無属性耐性</SelectItem>
                      <SelectItem key="flame">炎属性耐性</SelectItem>
                      <SelectItem key="water">水属性耐性</SelectItem>
                      <SelectItem key="wood">木属性耐性</SelectItem>
                      <SelectItem key="shine">光属性耐性</SelectItem>
                      <SelectItem key="dark">闇属性耐性</SelectItem>
                    </Select>
                    <Slider
                      formatOptions={{ style: "percent" }}
                      label="デバフ量"
                      maxValue={1.0}
                      minValue={0.0}
                      showSteps={true}
                      step={0.1}
                      marks={sliderMarks}
                      {...register("debuff.rate")}
                      onChange={(v) =>
                        typeof v === "number" && setValue("debuff.rate", v)
                      }
                      color="foreground"
                    />
                  </>
                )}
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
