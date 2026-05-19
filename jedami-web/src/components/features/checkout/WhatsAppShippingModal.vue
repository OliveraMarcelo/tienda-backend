<script setup lang="ts">
import { ref } from 'vue'
import Dialog from '@/components/ui/Dialog.vue'
import { PURCHASE_TYPES } from '@/lib/constants'
import type { PurchaseType } from '@/lib/constants'
import type { OrderItem } from '@/api/orders.api'

interface Props {
  open: boolean
  storeName: string
  whatsappNumber: string
  orderId: number
  createdAt: string
  totalAmount: number
  purchaseType: PurchaseType
  items?: OrderItem[]
}

const props = defineProps<Props>()
const emit = defineEmits<{ 'update:open': [value: boolean] }>()

const deliveryType = ref<'contraentrega' | 'envio'>('envio')
const fullName     = ref('')
const dni          = ref('')
const province     = ref('')
const address      = ref('')
const postalCode   = ref('')
const deliveryDetails = ref('')

function close() {
  emit('update:open', false)
}

function send() {
  const date  = new Date(props.createdAt)
  const hora  = date.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })
  const fecha = date.toLocaleDateString('es-AR', { day: 'numeric', month: 'numeric', year: 'numeric' })
  const orderId = String(props.orderId).padStart(8, '0')
  const total   = props.totalAmount.toLocaleString('es-AR', { maximumFractionDigits: 0 })

  const itemsLines = (props.items ?? []).map(item => {
    let desc = ''
    if (props.purchaseType === PURCHASE_TYPES.CURVA) {
      desc = item.size ? `Talle ${item.size}` : '—'
    } else {
      desc = item.size && item.color ? `${item.size} — ${item.color}` : 'Distribución proporcional'
    }
    const subtotal = (item.quantity * Number(item.unitPrice)).toLocaleString('es-AR', { maximumFractionDigits: 0 })
    return `✅ ${item.quantity} x ${desc} | $ ${subtotal}`
  }).join('\n')

  const deliveryLabel = deliveryType.value === 'contraentrega' ? 'Contraentrega' : 'Envío a domicilio'

  const customerSection = [
    'Datos del cliente',
    `  • Contraentrega/Envío: ${deliveryLabel}`,
    `  • Nombre y apellido: ${fullName.value}`,
    `  • DNI: ${dni.value}`,
    `  • Provincia: ${province.value}`,
    `  • Domicilio: ${address.value}`,
    `  • C.P.: ${postalCode.value}`,
    ...(deliveryType.value === 'contraentrega' && deliveryDetails.value
      ? [`  • Detalles del lugar de entrega: ${deliveryDetails.value}`]
      : []),
  ].join('\n')

  const lines = [
    `Hola ${props.storeName}! Realicé la transferencia para mi pedido, este es el detalle:`,
    '',
    `Orden Nº PED-${orderId}`,
    `${hora}   ${fecha}`,
    '',
    ...(itemsLines ? [itemsLines, ''] : []),
    customerSection,
    '',
    'Forma de Pago',
    '  • Método de Pago: Transferencia Bancaria',
    `  • Monto transferido: $ ${total}`,
    '',
    `* Total del Pedido: $ ${total}`,
    '',
    'Adjunto el comprobante.',
  ]

  const url = `https://wa.me/${props.whatsappNumber}?text=${encodeURIComponent(lines.join('\n'))}`
  window.open(url, '_blank')
  close()
}
</script>

<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <h2 class="text-lg font-bold text-gray-900 mb-4">Datos para el envío</h2>

    <div class="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 mb-4 text-sm text-amber-800">
      <span class="font-semibold">Importante:</span> El stock no queda reservado hasta que se reciba el comprobante de pago por WhatsApp.
    </div>

    <div class="space-y-4">
      <!-- Tipo de entrega -->
      <div>
        <p class="text-sm font-medium text-gray-700 mb-2">Tipo de entrega</p>
        <div class="flex gap-4">
          <label class="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
            <input type="radio" value="envio" v-model="deliveryType" class="accent-[#E91E8C]" />
            Envío a domicilio
          </label>
          <label class="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
            <input type="radio" value="contraentrega" v-model="deliveryType" class="accent-[#E91E8C]" />
            Contraentrega
          </label>
        </div>
      </div>

      <!-- Nombre y apellido -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Nombre y apellido</label>
        <input
          v-model="fullName"
          type="text"
          placeholder="Ej: Juan Pérez"
          class="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E91E8C]/30 focus:border-[#E91E8C]"
        />
      </div>

      <!-- DNI -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">DNI</label>
        <input
          v-model="dni"
          type="text"
          placeholder="Ej: 30123456"
          class="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E91E8C]/30 focus:border-[#E91E8C]"
        />
      </div>

      <!-- Provincia -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Provincia</label>
        <input
          v-model="province"
          type="text"
          placeholder="Ej: Buenos Aires"
          class="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E91E8C]/30 focus:border-[#E91E8C]"
        />
      </div>

      <!-- Domicilio -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Domicilio</label>
        <input
          v-model="address"
          type="text"
          placeholder="Ej: Av. Corrientes 1234"
          class="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E91E8C]/30 focus:border-[#E91E8C]"
        />
      </div>

      <!-- C.P. -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">C.P.</label>
        <input
          v-model="postalCode"
          type="text"
          placeholder="Ej: 1043"
          class="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E91E8C]/30 focus:border-[#E91E8C]"
        />
      </div>

      <!-- Detalles del lugar (solo contraentrega) -->
      <div v-if="deliveryType === 'contraentrega'">
        <label class="block text-sm font-medium text-gray-700 mb-1">Detalles del lugar de entrega</label>
        <textarea
          v-model="deliveryDetails"
          rows="2"
          placeholder="Ej: Edificio Torre A, piso 3, depto 12"
          class="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E91E8C]/30 focus:border-[#E91E8C] resize-none"
        ></textarea>
      </div>
    </div>

    <!-- Acciones -->
    <div class="flex justify-end gap-3 mt-6">
      <button
        @click="close"
        class="text-sm text-gray-500 hover:text-gray-700 font-medium px-4 py-2 rounded-xl hover:bg-gray-100 transition-colors"
      >
        Cancelar
      </button>
      <button
        @click="send"
        class="inline-flex items-center gap-2 rounded-xl bg-green-500 text-white px-4 py-2 text-sm font-semibold hover:opacity-90 transition-opacity"
      >
        <svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
        Enviar por WhatsApp
      </button>
    </div>
  </Dialog>
</template>
