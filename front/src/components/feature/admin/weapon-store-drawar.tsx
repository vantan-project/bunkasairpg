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
} from "@heroui/react";
import { PhysicsType } from "@/types/physics-type";
import { ElementType } from "@/types/element-type";
import { ImageIcon } from "@/components/shared/icons/image-icon";
import { useEffect } from "react";

type FormValues = {
  name: string;
  imageFile: File | null;
  physicsAttack: number;
  elementAttack: number | null;
  physicsType: PhysicsType;
  elementType: ElementType;
};

type Props = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
};

export function WeaponStoreDrawer({ isOpen, onOpenChange }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<FormValues>();

  const imageFile = watch("imageFile");
  const elementType = watch("elementType");

  useEffect(() => {
    if (elementType === "neutral") {
      setValue("elementAttack", null);
    }
  }, [elementType]);

  return (
    <Drawer
      size="xl"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      placement="bottom"
      hideCloseButton
    >
      <DrawerContent className="h-[80vh]">
        <DrawerHeader>武器追加</DrawerHeader>
        <DrawerBody>
          <Form className="flex flex-col gap-12">
            <div className="grid grid-cols-[300px_auto] gap-4 w-full">
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
                <NumberInput
                  label="物理攻撃力"
                  {...register("physicsAttack")}
                  onChange={(v) =>
                    typeof v === "number" && setValue("physicsAttack", v)
                  }
                />
                <NumberInput
                  label="属性攻撃力"
                  isDisabled={elementType === "neutral"}
                  {...register("elementAttack")}
                  onChange={(v) =>
                    typeof v === "number" && setValue("elementAttack", v)
                  }
                />
                <Select label="攻撃タイプ" {...register("physicsType")}>
                  <SelectItem key="slash">斬撃</SelectItem>
                  <SelectItem key="blow">打撃</SelectItem>
                  <SelectItem key="shoot">射撃</SelectItem>
                </Select>
                <Select label="属性" {...register("elementType")}>
                  <SelectItem key="neutral">無属性</SelectItem>
                  <SelectItem key="flame">炎属性</SelectItem>
                  <SelectItem key="water">水属性</SelectItem>
                  <SelectItem key="wood">木属性</SelectItem>
                  <SelectItem key="shine">光属性</SelectItem>
                  <SelectItem key="dark">闇属性</SelectItem>
                </Select>
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
