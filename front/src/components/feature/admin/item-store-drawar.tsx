import { PhysicsType } from "@/types/physics-type";
import { ElementType } from "@/types/element-type";
import { EffectType } from "@/types/effect-type";
import { useForm } from "react-hook-form";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Button,
  useDisclosure,
  DrawerProps,
  Form,
} from "@heroui/react";
import { ImageIcon } from "@/components/shared/icons/image-icon";

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
  isOpen: DrawerProps["isOpen"];
  onOpenChange: DrawerProps["onOpenChange"];
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
    getValues,
    watch,
  } = useForm<FormValues>();

  // const form = useForm<Form>({
  //   initialValues: {
  //     name: "",
  //     imageFile: null as File | null,
  //     effectType: "heal",
  //     heal: {
  //       amount: 0,
  //     },
  //     buff: {
  //       rate: 0.0,
  //       target: "slash",
  //     },
  //     debuff: {
  //       rate: 0.0,
  //       target: "slash",
  //     },
  //   },
  //   validate: {
  //     name: (value) => (value.length === 0 ? "名前は必須です" : null),
  //     heal: (_, v) =>
  //       v.effectType === "heal" && v.heal.amount <= 0
  //         ? "回復量を入力してください"
  //         : null,
  //     buff: (_, v) =>
  //       v.effectType === "buff" && v.buff.rate <= 0
  //         ? "バフ量を入力してください"
  //         : null,
  //     debuff: (_, v) =>
  //       v.effectType === "debuff" && v.debuff.rate <= 0
  //         ? "デバフ量を入力してください"
  //         : null,
  //   },
  // });

  const imageFile = watch("imageFile");
  return (
    <Drawer
      size="4xl"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      placement="bottom"
      hideCloseButton
    >
      <DrawerContent className="h-[80vh]">
        <DrawerHeader>アイテム追加</DrawerHeader>
        <Form>
          <div className="grid grid-cols-[300px_auto] gap-4">
            <div className="">
              <input
                className="hidden"
                type="file"
                id="file"
                {...register("imageFile")}
              />
              <label className="block aspect-square border-1" htmlFor="file">
                {imageFile ? (
                  <></>
                ) : (
                  <div className="h-full flex justify-center items-center">
                    <ImageIcon className="w-12 h-12 text-black" />
                  </div>
                )}
              </label>
            </div>

            <div />
          </div>
        </Form>
      </DrawerContent>
    </Drawer>
    // <MantineDrawer
    //   opened={opened}
    //   onClose={close}
    //   title="アイテム追加"
    //   position="bottom"
    //   size="lg"
    //   radius="lg"
    //   classNames={{
    //     title: "!font-bold text-black",
    //   }}
    // >
    //   <form className="p-4 flex flex-col gap-12">
    //     <div className="grid grid-cols-[300px_auto] gap-4">
    //       <div>
    //         画像
    //         <MantineDropzone
    //           onDrop={(f) => form.setFieldValue("imageFile", f[0])}
    //           classNames={{
    //             root: "aspect-square !p-0",
    //             inner: "h-full",
    //           }}
    //         >
    //           {form.values.imageFile === null ? (
    //             <div className="h-full flex justify-center items-center">
    //               <ImageIcon className="w-12 h-12 text-black" />
    //             </div>
    //           ) : (
    //             <MantineImage
    //               src={URL.createObjectURL(form.values.imageFile)}
    //             />
    //           )}
    //         </MantineDropzone>
    //       </div>

    //       <div className="flex flex-col gap-4">
    //         <MantineTextInput label="名前" {...form.getInputProps("name")} />
    //         <AdminSelect
    //           label="カテゴリー"
    //           data={[
    //             { value: "heal", label: "ヒール" },
    //             { value: "buff", label: "バフ" },
    //             { value: "debuff", label: "デバフ" },
    //           ]}
    //           {...form.getInputProps("effectType")}
    //         />

    //         {form.values.effectType === "heal" && (
    //           <MantineTextInput
    //             label="回復量"
    //             type="number"
    //             {...form.getInputProps("heal.amount")}
    //           />
    //         )}

    //         {form.values.effectType === "buff" && (
    //           <>
    //             <AdminSelect
    //               label="バフ対象"
    //               data={[
    //                 { value: "slash", label: "斬撃威力" },
    //                 { value: "blow", label: "打撃威力" },
    //                 { value: "shoot", label: "射撃威力" },
    //                 { value: "neutral", label: "無属性威力" },
    //                 { value: "flame", label: "炎属性威力" },
    //                 { value: "water", label: "水属性威力" },
    //                 { value: "wood", label: "木属性威力" },
    //                 { value: "shine", label: "光属性威力" },
    //                 { value: "dark", label: "闇属性威力" },
    //               ]}
    //               {...form.getInputProps("buff.target")}
    //             />

    //             <div>
    //               バフ量
    //               <MantineSlider
    //                 label={(v) =>
    //                   sliderMarks.find(({ value }) => value === v)?.label
    //                 }
    //                 color="gray"
    //                 step={0.1}
    //                 min={0.0}
    //                 max={1.0}
    //                 marks={sliderMarks}
    //                 {...form.getInputProps("buff.rate")}
    //               />
    //             </div>
    //           </>
    //         )}

    //         {form.values.effectType === "debuff" && (
    //           <>
    //             <AdminSelect
    //               label="デバフ対象"
    //               data={[
    //                 { value: "slash", label: "斬撃耐性" },
    //                 { value: "blow", label: "打撃耐性" },
    //                 { value: "shoot", label: "射撃耐性" },
    //                 { value: "neutral", label: "無属性耐性" },
    //                 { value: "flame", label: "炎属性耐性" },
    //                 { value: "water", label: "水属性耐性" },
    //                 { value: "wood", label: "木属性耐性" },
    //                 { value: "shine", label: "光属性耐性" },
    //                 { value: "dark", label: "闇属性耐性" },
    //               ]}
    //               {...form.getInputProps("debuff.target")}
    //             />

    //             <div>
    //               デバフ量
    //               <MantineSlider
    //                 label={(v) =>
    //                   sliderMarks.find(({ value }) => value === v)?.label
    //                 }
    //                 color="gray"
    //                 step={0.1}
    //                 min={0.0}
    //                 max={1.0}
    //                 marks={sliderMarks}
    //                 {...form.getInputProps("debuff.rate")}
    //               />
    //             </div>
    //           </>
    //         )}
    //       </div>
    //     </div>

    //     <AdminButton type="submit">追加</AdminButton>
    //   </form>
    // </MantineDrawer>
  );
}
