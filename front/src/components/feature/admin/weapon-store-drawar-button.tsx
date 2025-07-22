import { MantineDrawer } from "@/components/shared/mantine/mantine-drawer";
import { MantineDropzone } from "@/components/shared/mantine/mantine-dropzone";
import { MantineImage } from "@/components/shared/mantine/mantine-image";
import { MantineNavLink } from "@/components/shared/mantine/mantine-nav-link";
import { MantineSelect } from "@/components/shared/mantine/mantine-select";
import { MantineTextInput } from "@/components/shared/mantine/mantine-text-input";
import { ElementType } from "@/types/element-type";
import { PhysicsType } from "@/types/physics-type";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { useEffect } from "react";
import { AdminButton } from "./admin-button";
import { ImageIcon } from "@/components/shared/icons/image-icon";
import { AddIcon } from "@/components/shared/icons/add-icon";

type Form = {
  name: string;
  imageFile: File | null;
  physicsAttack: number;
  elementAttack: number | null;
  physicsType: PhysicsType;
  elementType: ElementType;
};

export function WeaponStoreDrawerButton() {
  const [opened, { open, close }] = useDisclosure(false);

  const form = useForm<Form>({
    initialValues: {
      name: "",
      imageFile: null,
      physicsAttack: 0,
      elementAttack: 0,
      physicsType: "slash",
      elementType: "neutral",
    },
  });

  useEffect(() => {
    if (form.values.elementType === "neutral") {
      form.setFieldValue("elementAttack", null);
    }
  }, [form.values.elementType]);

  return (
    <>
      <MantineNavLink
        onClick={open}
        label="武器追加"
        leftSection={<AddIcon />}
      />
      <MantineDrawer
        opened={opened}
        onClose={close}
        title="武器追加"
        position="bottom"
        size="lg"
        radius="lg"
        classNames={{
          title: "!font-bold",
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

            <div className="flex flex-col gap-4">
              <MantineTextInput label="名前" {...form.getInputProps("name")} />
              <MantineTextInput
                label="物理攻撃力"
                type="number"
                {...form.getInputProps("physicsAttack")}
              />
              <MantineTextInput
                label="属性攻撃力"
                type="number"
                disabled={form.values.elementType === "neutral"}
                {...form.getInputProps("elementAttack")}
                value={form.values.elementAttack || ""}
              />

              <MantineSelect
                label="攻撃タイプ"
                data={[
                  { value: "slash", label: "斬撃" },
                  { value: "blow", label: "打撃" },
                  { value: "shoot", label: "射撃" },
                ]}
                {...form.getInputProps("physicsType")}
              />
              <MantineSelect
                label="属性"
                data={[
                  { value: "neutral", label: "無属性" },
                  { value: "flame", label: "炎属性" },
                  { value: "water", label: "水属性" },
                  { value: "wood", label: "木属性" },
                  { value: "shine", label: "光属性" },
                  { value: "dark", label: "闇属性" },
                ]}
                {...form.getInputProps("elementType")}
              />
            </div>
          </div>

          <AdminButton type="submit">追加</AdminButton>
        </form>
      </MantineDrawer>
    </>
  );
}
